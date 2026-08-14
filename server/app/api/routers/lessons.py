import time
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import UserStats, DailyActivity
from app.schemas.lesson import LessonCompleteRequest, LessonCompleteResponse

router = APIRouter(prefix="/lessons", tags=["lessons"])

def get_current_user_id(x_user_id: str = Header(default="seed_user_1")):
    return x_user_id

@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(
    lesson_id: str, 
    request: LessonCompleteRequest, 
    db: Session = Depends(get_db), 
    user_id: str = Depends(get_current_user_id)
):
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
        
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    now_ts = int(time.time())
    streak_incremented = False
    
    # Check streak increment logic
    if stats.last_activity_date != today_str:
        stats.current_streak += 1
        stats.longest_streak = max(stats.longest_streak, stats.current_streak)
        stats.last_activity_date = today_str
        streak_incremented = True
        
    # Award XP
    stats.total_xp += request.xpAwarded
    stats.updated_at = now_ts
    
    # Handle hearts loss
    if request.heartsLost > 0:
        stats.hearts = max(0, stats.hearts - request.heartsLost)
        if not stats.last_heart_lost_at and stats.hearts < stats.max_hearts:
            stats.last_heart_lost_at = now_ts
            
    # Update Daily Activity
    daily = db.query(DailyActivity).filter_by(user_id=user_id, date=today_str).first()
    if daily:
        daily.xp_earned += request.xpAwarded
        daily.lessons_completed += 1
    else:
        daily = DailyActivity(
            user_id=user_id,
            date=today_str,
            xp_earned=request.xpAwarded,
            lessons_completed=1
        )
        db.add(daily)
        
    db.commit()
    db.refresh(stats)
    
    return LessonCompleteResponse(
        success=True,
        xpAwarded=request.xpAwarded,
        newTotalXp=stats.total_xp,
        streakCount=stats.current_streak,
        streakIncremented=streak_incremented,
        heartsRemaining=stats.hearts
    )
