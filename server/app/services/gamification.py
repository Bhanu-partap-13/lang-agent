import time
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import UserStats, DailyActivity

HEART_REGEN_INTERVAL_SECONDS = 240 # 4 minutes
MAX_HEARTS = 5

def evaluate_heart_regeneration(db: Session, stats: UserStats) -> UserStats:
    now_ts = int(time.time())
    
    if stats.hearts < stats.max_hearts and stats.last_heart_lost_at:
        seconds_passed = now_ts - stats.last_heart_lost_at
        hearts_to_recover = int(seconds_passed // HEART_REGEN_INTERVAL_SECONDS)
        
        if hearts_to_recover > 0:
            new_hearts = min(stats.max_hearts, stats.hearts + hearts_to_recover)
            
            if new_hearts == stats.max_hearts:
                stats.hearts = new_hearts
                stats.last_heart_lost_at = None
            else:
                stats.hearts = new_hearts
                stats.last_heart_lost_at = stats.last_heart_lost_at + (hearts_to_recover * HEART_REGEN_INTERVAL_SECONDS)
            
            stats.updated_at = now_ts
            db.commit()
            
    return stats

def evaluate_streak_missed(db: Session, stats: UserStats) -> UserStats:
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    now_ts = int(time.time())
    
    if stats.last_activity_date and stats.last_activity_date != today_str:
        last_date = datetime.strptime(stats.last_activity_date, "%Y-%m-%d").date()
        today_date = datetime.strptime(today_str, "%Y-%m-%d").date()
        diff_days = (today_date - last_date).days
        
        if diff_days > 1:
            stats.current_streak = 0
            stats.updated_at = now_ts
            db.commit()
            
    return stats

def record_daily_activity(db: Session, user_id: str, xp_awarded: int, lessons_completed: int):
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    daily = db.query(DailyActivity).filter_by(user_id=user_id, date=today_str).first()
    if daily:
        daily.xp_earned += xp_awarded
        daily.lessons_completed += lessons_completed
    else:
        daily = DailyActivity(
            user_id=user_id,
            date=today_str,
            xp_earned=xp_awarded,
            lessons_completed=lessons_completed
        )
        db.add(daily)
    db.commit()
    return daily
