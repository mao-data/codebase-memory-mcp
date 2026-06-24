import json
import os
from datetime import datetime
from typing import Optional

from anthropic import Anthropic
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field, field_validator

router = APIRouter()
client = Anthropic()

BUDGET_DESC = {
    "budget":      "budget-friendly (hostels/guesthouses, street food, free/cheap attractions, public transit)",
    "mid":         "mid-range (3-star hotels, local restaurants, mix of paid attractions, some taxis)",
    "comfortable": "comfortable (4-star hotels, good restaurants, major attractions, Uber/taxi)",
    "luxury":      "luxury (5-star hotels, fine dining, exclusive experiences, private transfers)",
}

STYLE_ICONS = {
    "cultural":   "cultural sights, museums, temples, historical sites",
    "foodie":     "food tours, local markets, signature dishes, cooking classes",
    "nature":     "parks, hiking, scenic spots, outdoor activities",
    "shopping":   "markets, malls, local boutiques, souvenirs",
    "adventure":  "outdoor adventures, sports, unique experiences",
    "relaxation": "spas, beaches, slow-paced walks, cafes",
}

VALID_STYLES = set(STYLE_ICONS.keys())
VALID_BUDGETS = set(BUDGET_DESC.keys())


# ── Request model with strict validation ──────────────────────────────────────

class TripRequest(BaseModel):
    destination: str = Field(..., min_length=1, max_length=100)
    startDate: Optional[str] = Field(default="", max_length=10)
    endDate: Optional[str] = Field(default="", max_length=10)
    travelers: int = Field(default=2, ge=1, le=50)
    styles: list[str] = Field(default_factory=list, max_length=6)
    budget: str = Field(default="mid")
    notes: Optional[str] = Field(default="", max_length=500)

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: str) -> str:
        if v not in VALID_BUDGETS:
            raise ValueError(f"budget must be one of {sorted(VALID_BUDGETS)}")
        return v

    @field_validator("styles")
    @classmethod
    def validate_styles(cls, v: list[str]) -> list[str]:
        invalid = [s for s in v if s not in VALID_STYLES]
        if invalid:
            raise ValueError(f"unknown styles: {invalid}")
        return v

    @field_validator("startDate", "endDate")
    @classmethod
    def validate_date_format(cls, v: Optional[str]) -> Optional[str]:
        if v:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise ValueError("Date must be YYYY-MM-DD")
        return v


# ── AI response models (validate what Claude returns) ─────────────────────────

class ActivityOut(BaseModel):
    type: str = "activity"
    title: str
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    cost: Optional[float] = None
    currency: str = "USD"


class DayOut(BaseModel):
    day_number: int
    date: Optional[str] = None
    title: Optional[str] = None
    activities: list[ActivityOut] = []


class ItineraryOut(BaseModel):
    title: str
    destination: str
    days: list[DayOut]


# ── Helpers ───────────────────────────────────────────────────────────────────

def calc_days(start: str, end: str) -> int:
    try:
        s = datetime.strptime(start, "%Y-%m-%d")
        e = datetime.strptime(end, "%Y-%m-%d")
        return max(1, (e - s).days + 1)
    except ValueError:
        return 5


def build_prompt(req: TripRequest, num_days: int) -> str:
    styles_text = (
        ", ".join(STYLE_ICONS[s] for s in req.styles if s in STYLE_ICONS)
        or "a balanced mix of sightseeing, food, and local culture"
    )
    budget_text = BUDGET_DESC.get(req.budget, BUDGET_DESC["mid"])

    # json.dumps safely escapes user strings to prevent prompt injection
    safe_destination = json.dumps(req.destination)
    safe_notes = json.dumps(req.notes or "none")
    safe_start = json.dumps(req.startDate or "flexible")

    return f"""You are an expert travel planner. Create a detailed, realistic {num_days}-day trip itinerary.

TRIP DETAILS:
- Destination: {safe_destination}
- Duration: {num_days} days
- Travelers: {req.travelers} person(s)
- Travel style: {styles_text}
- Budget level: {budget_text}
- Start date: {safe_start}
- Special requests: {safe_notes}

OUTPUT FORMAT: Return ONLY valid JSON, no markdown fences, no explanation.

{{
  "title": "Engaging trip title (e.g. Tokyo Street Food & Temple Adventure)",
  "destination": "City, Country",
  "days": [
    {{
      "day_number": 1,
      "date": "{req.startDate or ''}",
      "title": "Descriptive day theme",
      "activities": [
        {{
          "type": "flight|hotel|activity|restaurant|transport",
          "title": "Specific activity/place name",
          "description": "2-3 sentences with practical tips and what makes it special",
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "location": "Specific venue, district, or address",
          "cost": 0,
          "currency": "USD"
        }}
      ]
    }}
  ]
}}

STRICT RULES:
1. Include 4-6 activities per day, varied types
2. Day 1 first activity: arrival transport or flight (type: "transport" or "flight")
3. Day 1: include hotel check-in (type: "hotel") — only once for the whole trip
4. Every day: at least 1 restaurant or food activity (type: "restaurant")
5. Use REAL, specific place names — not generic descriptions
6. Costs must match the {req.budget} budget level
7. Start/end times must be realistic (no 3am sightseeing)
8. For the destination, prefer local currency if well-known (JPY, EUR, THB, etc.)
9. descriptions must be informative and enticing — not boilerplate"""


# ── Route ─────────────────────────────────────────────────────────────────────

@router.post("/generate")
async def generate_trip(
    req: TripRequest,
    x_backend_token: Optional[str] = Header(default=None, alias="X-Backend-Token"),
):
    # Shared-secret auth between Next.js API route and this service
    expected_token = os.getenv("BACKEND_SECRET_TOKEN")
    if expected_token and x_backend_token != expected_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Server-side date range validation
    if req.startDate and req.endDate:
        s = datetime.strptime(req.startDate, "%Y-%m-%d")
        e = datetime.strptime(req.endDate, "%Y-%m-%d")
        if e < s:
            raise HTTPException(status_code=400, detail="endDate must be on or after startDate")

    num_days = calc_days(req.startDate or "", req.endDate or "")
    prompt = build_prompt(req, num_days)

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}],
        )

        raw = response.content[0].text.strip()

        # Strip accidental markdown fences
        if raw.startswith("```"):
            parts = raw.split("```")
            raw = parts[1].lstrip("json").strip() if len(parts) >= 2 else raw

        raw_dict = json.loads(raw)

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Validate and coerce the full AI response structure
    try:
        itinerary = ItineraryOut(**raw_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI returned unexpected structure: {e}")

    return itinerary.model_dump()
