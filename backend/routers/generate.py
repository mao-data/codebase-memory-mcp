import json
import os
from datetime import datetime
from typing import Optional

from anthropic import Anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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


class TripRequest(BaseModel):
    destination: str
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    travelers: int = 2
    styles: list[str] = []
    budget: str = "mid"
    notes: Optional[str] = ""


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

    return f"""You are an expert travel planner. Create a detailed, realistic {num_days}-day trip itinerary.

TRIP DETAILS:
- Destination: {req.destination}
- Duration: {num_days} days
- Travelers: {req.travelers} person(s)
- Travel style: {styles_text}
- Budget level: {budget_text}
- Start date: {req.startDate or "flexible"}
- Special requests: {req.notes or "none"}

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
8. For {req.destination}, prefer local currency if well-known (JPY, EUR, THB, etc.)
9. descriptions must be informative and enticing — not boilerplate"""


@router.post("/generate")
async def generate_trip(req: TripRequest):
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

        itinerary = json.loads(raw)

        # Validate minimum structure
        if "days" not in itinerary or not itinerary["days"]:
            raise ValueError("AI returned itinerary without days")

        return itinerary

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
