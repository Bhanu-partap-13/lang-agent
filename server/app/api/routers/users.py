import time
import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import UserStats, DailyActivity, UserProfile, Achievement, UserAchievement
from app.schemas.user import UserStatsResponse, SimulateXpRequest, SimulateXpResponse, ClaimChestResponse
from app.schemas.shop import BuyHeartsResponse
from app.schemas.profile import UserProfileResponse, ProfileStats, ProfileAchievement
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

@router.post("/buy-hearts", response_model=BuyHeartsResponse)
def buy_hearts(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
    
    if stats.hearts >= stats.max_hearts:
        raise HTTPException(status_code=400, detail="Hearts are already full")
        
    if stats.gems < 350:
        raise HTTPException(status_code=400, detail="Not enough gems. Need 350 gems.")
        
    stats.gems -= 350
    stats.hearts = stats.max_hearts
    stats.last_heart_lost_at = None
    stats.updated_at = int(time.time())
    
    db.commit()
    db.refresh(stats)
    
    return BuyHeartsResponse(
        success=True,
        hearts=stats.hearts,
        gems=stats.gems,
        message="Hearts refilled successfully!"
    )

@router.get("/profile", response_model=UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    # 1. JIT provision stats
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    now_ts = int(time.time())
    if not stats:
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

    # 2. JIT provision profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(
            user_id=user_id,
            username=user_id.split("@")[0] if "@" in user_id else f"Learner_{user_id[-4:]}" if len(user_id) > 4 else "Learner",
            created_at=now_ts
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # 3. Seed achievements if table is completely empty
    ach_count = db.query(Achievement).count()
    if ach_count == 0:
        default_achievements = [
            Achievement(
                id="ach_streak_3",
                code="streak_3",
                title="3-Day Streak",
                description="Keep the fire burning! Reach a 3-day learning streak.",
                icon_url="/achievements/streak.svg",
                criteria={"type": "streak", "value": 3}
            ),
            Achievement(
                id="ach_xp_100",
                code="xp_100",
                title="First 100 XP",
                description="Getting serious! Earn a total of 100 XP.",
                icon_url="/achievements/xp.svg",
                criteria={"type": "xp", "value": 100}
            ),
            Achievement(
                id="ach_streak_7",
                code="streak_7",
                title="Super Streak",
                description="Unstoppable! Reach a 7-day learning streak.",
                icon_url="/achievements/streak_7.svg",
                criteria={"type": "streak", "value": 7}
            ),
            Achievement(
                id="ach_xp_500",
                code="xp_500",
                title="XP Overlord",
                description="Knowledge champion! Earn a total of 500 XP.",
                icon_url="/achievements/xp_500.svg",
                criteria={"type": "xp", "value": 500}
            )
        ]
        for ach in default_achievements:
            db.add(ach)
        db.commit()

    # 4. Fetch all achievements and user unlocked achievements
    all_achievements = db.query(Achievement).all()
    user_ach_list = db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    unlocked_map = {ua.achievement_id: ua.unlocked_at for ua in user_ach_list}

    # 5. Evaluate achievements on the fly
    profile_achievements = []
    for ach in all_achievements:
        unlocked_at = unlocked_map.get(ach.id)
        is_unlocked = unlocked_at is not None

        if not is_unlocked:
            # Check if user meets criteria now
            criteria = ach.criteria or {}
            c_type = criteria.get("type")
            c_val = criteria.get("value", 0)
            should_unlock = False

            if c_type == "streak" and stats.longest_streak >= c_val:
                should_unlock = True
            elif c_type == "xp" and stats.total_xp >= c_val:
                should_unlock = True

            if should_unlock:
                new_ua = UserAchievement(
                    user_id=user_id,
                    achievement_id=ach.id,
                    unlocked_at=now_ts
                )
                db.add(new_ua)
                db.commit()
                is_unlocked = True
                unlocked_at = now_ts

        profile_achievements.append(
            ProfileAchievement(
                id=ach.id,
                code=ach.code,
                title=ach.title,
                description=ach.description,
                iconUrl=ach.icon_url,
                unlockedAt=unlocked_at,
                isUnlocked=is_unlocked
            )
        )

    # Sort achievements: unlocked first, then by code
    profile_achievements.sort(key=lambda x: (not x.isUnlocked, x.code))

    return UserProfileResponse(
        userId=profile.user_id,
        username=profile.username,
        joinedAt=profile.created_at,
        stats=ProfileStats(
            totalXp=stats.total_xp,
            currentStreak=stats.current_streak,
            longestStreak=stats.longest_streak,
            hearts=stats.hearts,
            gems=stats.gems
        ),
        achievements=profile_achievements
    )
