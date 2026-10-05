from fastapi import APIRouter, HTTPException

from app.mock import state
from app.models import Session

router = APIRouter(tags=["sessions"])


@router.get("/sessions/active", response_model=Session | None)
def get_active_session() -> Session | None:
    return state.session