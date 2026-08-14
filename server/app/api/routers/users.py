import time
import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import UserStats, DailyActivity
from app.schemas.user import UserStatsResponse, SimulateXpRequest, SimulateXpResponse, ClaimChestResponse
from app.services.gamification import evaluate_heart_regeneration, evaluate_streak_missed

router = APIRouter(prefix="/user", tags=["user"])

def get_current_user_id(x_user_id: str = Header(default="seed_user_1")):
    return x_user_id

@router.get("/stats")
def get_user_stats(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        # Auto-provision JIT for this backend if missing
        now_ts = int(time.time())
        stats = UserStats(
            user_id=user_id,
            total_xp=0,
            current_streak=0,
            longest_streak=0,
            hearts=5,
            max_hearts=5,
            gems=500,
            daily_goal_xp=20,
            updated_at=now_ts
        )
        db.add(stats)
        db.commit()
        db.refresh(stats)

    # 1. Evaluate Missed Streak
    stats = evaluate_streak_missed(db, stats)
    
    # 2. Evaluate Heart Regeneration
    stats = evaluate_heart_regeneration(db, stats)
    
    # Return matched to schema
    return {
        "userId": stats.user_id,
        "totalXp": stats.total_xp,
        "currentStreak": stats.current_streak,
        "longestStreak": stats.longest_streak,
        "lastActivityDate": stats.last_activity_date,
        "streakFreezeCount": stats.streak_freeze_count,
        "hearts": stats.hearts,
        "maxHearts": stats.max_hearts,
        "lastHeartLostAt": stats.last_heart_lost_at,
        "gems": stats.gems,
        "dailyGoalXp": stats.daily_goal_xp,
        "updatedAt": stats.updated_at
    }

@router.post("/simulate-xp", response_model=SimulateXpResponse)
def simulate_xp(request: SimulateXpRequest, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
        
    stats.total_xp += request.xp
    stats.updated_at = int(time.time())
    
    # Also log to daily activity for chest eligibility
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    daily = db.query(DailyActivity).filter_by(user_id=user_id, date=today_str).first()
    if daily:
        daily.xp_earned += request.xp
    else:
        daily = DailyActivity(user_id=user_id, date=today_str, xp_earned=request.xp)
        db.add(daily)
        
    db.commit()
    db.refresh(stats)
    
    return SimulateXpResponse(success=True, xpAdded=request.xp, newTotalXp=stats.total_xp)

@router.post("/claim-chest", response_model=ClaimChestResponse)
def claim_chest(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    daily = db.query(DailyActivity).filter_by(user_id=user_id, date=today_str).first()
    
    if not daily or daily.xp_earned < 100:
        raise HTTPException(status_code=400, detail="Not eligible for chest. Need 100 XP today.")
        
    if daily.chest_claimed:
        raise HTTPException(status_code=400, detail="Chest already claimed today.")
        
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
        
    gems_awarded = random.choice([50, 100])
    hearts_awarded = max(1, stats.max_hearts - stats.hearts)
    
    stats.gems += gems_awarded
    stats.hearts = stats.max_hearts
    stats.updated_at = int(time.time())
    
    daily.chest_claimed = True
    
    db.commit()
    db.refresh(stats)
    
    return ClaimChestResponse(
        success=True, 
        gemsAwarded=gems_awarded, 
        heartsAwarded=hearts_awarded,
        newGemsTotal=stats.gems,
        newHeartsTotal=stats.hearts
    )
