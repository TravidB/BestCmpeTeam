import math
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.rapidapi_client import RapidApiError, get_rapidapi_client
from app.services.rapidapi_service import RapidApiService

router = APIRouter(prefix="", tags=["rapidapi"])

# ── Geocode / Walking-route helpers ────────────────────────────────────────────

_CITY_COORDS: dict[str, tuple[float, float]] = {
    "new york": (40.7128, -74.0060),
    "los angeles": (34.0522, -118.2437),
    "san francisco": (37.7749, -122.4194),
    "paris": (48.8566, 2.3522),
    "london": (51.5074, -0.1278),
    "tokyo": (35.6762, 139.6503),
    "honolulu": (21.3069, -157.8583),
    "chicago": (41.8781, -87.6298),
    "miami": (25.7617, -80.1918),
    "seattle": (47.6062, -122.3321),
    "boston": (42.3601, -71.0589),
    "dubai": (25.2048, 55.2708),
    "singapore": (1.3521, 103.8198),
    "sydney": (-33.8688, 151.2093),
    "seoul": (37.5665, 126.9780),
    "bangkok": (13.7563, 100.5018),
    "frankfurt": (50.1109, 8.6821),
    "amsterdam": (52.3676, 4.9041),
    "toronto": (43.6532, -79.3832),
    "vancouver": (49.2827, -123.1207),
    "madrid": (40.4168, -3.7038),
    "rome": (41.9028, 12.4964),
}

def _haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 3958.8
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


@router.get("/geocode", summary="Geocode a location name to lat/lon", tags=["geocode"])
async def geocode(text: str = Query(..., description="Location name, e.g. 'Central Park New York'")):
    key = text.lower().strip()
    for city, (lat, lon) in _CITY_COORDS.items():
        if city in key or key in city:
            return {"lat": lat, "lon": lon, "display_name": city.title(), "source": "local"}
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": text, "format": "json", "limit": 1},
                headers={"User-Agent": "TravelEase/1.0"},
            )
            data = resp.json()
            if data:
                return {
                    "lat": float(data[0]["lat"]),
                    "lon": float(data[0]["lon"]),
                    "display_name": data[0]["display_name"],
                    "source": "nominatim",
                }
    except Exception:
        pass
    raise HTTPException(status_code=404, detail=f"invalid geocode, no location found for: {text}")


@router.get("/walking-route", summary="Calculate walking distance between two coordinates", tags=["geocode"])
async def walking_route(
    start_lat: float = Query(...),
    start_lon: float = Query(...),
    end_lat: float = Query(...),
    end_lon: float = Query(...),
):
    dist_miles = _haversine_miles(start_lat, start_lon, end_lat, end_lon)
    dist_km = round(dist_miles * 1.60934, 2)
    dist_miles = round(dist_miles, 2)
    if dist_miles > 3.0:
        return {
            "distance_miles": dist_miles,
            "distance_km": dist_km,
            "walkable": False,
            "message": "invalid walking route — distance too far, consider alternate transportation",
        }
    return {"distance_miles": dist_miles, "distance_km": dist_km, "walkable": True}

def get_rapidapi_service() -> RapidApiService:
    return RapidApiService(get_rapidapi_client())


@router.get("/attractions/search")
async def search_attractions(
    start_date: str = Query(..., description="Format: YYYY-MM-DD"),
    end_date: str = Query(..., description="Format: YYYY-MM-DD"),
    dest_name: str = Query(..., description="Example: New York"),
    country_name: str = Query(..., description="Example: United States"),
    locale: str = Query("en-gb"),
    page_number: int = Query(0, ge=0),
    currency: str = Query("AED"),
    order_by: str = Query("attr_book_score"),
    service: RapidApiService = Depends(get_rapidapi_service),
):
    try:
        return service.search_attractions(
            start_date=start_date,
            end_date=end_date,
            dest_name=dest_name,
            country_name=country_name,
            locale=locale,
            page_number=page_number,
            currency=currency,
            order_by=order_by,
        )
    except RapidApiError as error:
        raise HTTPException(status_code=error.status_code, detail=error.detail) from error


@router.get("/hotels/search")
async def search_hotels(
    page_number: int = Query(0, ge=0),
    dest_type: str = Query("city"),
    dest_name: str = Query(..., description="Example: New York"),
    country_name: str = Query(..., description="Example: United States"),
    units: str = Query("metric"),
    children_number: int = Query(0, ge=0),
    locale: str = Query("en-gb"),
    categories_filter_ids: str | None = Query(None),
    children_ages: str | None = Query(None, description="Comma-separated ages, e.g. 5,0"),
    include_adjacency: bool = Query(True),
    filter_by_currency: str = Query("AED"),
    order_by: str = Query("popularity"),
    checkin_date: str = Query(..., description="Format: YYYY-MM-DD"),
    checkout_date: str = Query(..., description="Format: YYYY-MM-DD"),
    room_number: int = Query(1, ge=1),
    adults_number: int = Query(1, ge=1),
    service: RapidApiService = Depends(get_rapidapi_service),
):
    try:
        return service.search_hotels(
            page_number=page_number,
            dest_type=dest_type,
            dest_name=dest_name,
            country_name=country_name,
            units=units,
            children_number=children_number,
            locale=locale,
            categories_filter_ids=categories_filter_ids,
            children_ages=children_ages,
            include_adjacency=include_adjacency,
            filter_by_currency=filter_by_currency,
            order_by=order_by,
            checkin_date=checkin_date,
            checkout_date=checkout_date,
            room_number=room_number,
            adults_number=adults_number,
        )
    except RapidApiError as error:
        raise HTTPException(status_code=error.status_code, detail=error.detail) from error


@router.get("/flights/search")
async def search_flights(
    depart_date: str = Query(..., description="Format: YYYY-MM-DD"),
    from_code: str = Query(..., description="Example: ONT.AIRPORT"),
    to_code: str = Query(..., description="Example: NYC.CITY"),
    adults: int = Query(1, ge=1),
    locale: str = Query("en-gb"),
    page_number: int = Query(0, ge=0),
    currency: str = Query("AED"),
    order_by: str = Query("BEST"),
    flight_type: str = Query("ONEWAY"),
    cabin_class: str = Query("ECONOMY"),
    children_ages: str | None = Query(None, description="Comma-separated ages, e.g. 5,0"),
    return_date: str | None = Query(None, description="Format: YYYY-MM-DD"),
    service: RapidApiService = Depends(get_rapidapi_service),
):
    try:
        return service.search_flights(
            depart_date=depart_date,
            from_code=from_code,
            to_code=to_code,
            adults=adults,
            locale=locale,
            page_number=page_number,
            currency=currency,
            order_by=order_by,
            flight_type=flight_type,
            cabin_class=cabin_class,
            children_ages=children_ages,
            return_date=return_date,
        )
    except RapidApiError as error:
        raise HTTPException(status_code=error.status_code, detail=error.detail) from error
