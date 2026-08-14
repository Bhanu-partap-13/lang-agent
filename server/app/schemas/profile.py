from pydantic import BaseModel
from typing import List, Optional

class ProfileAchievement(BaseModel):
    id: str
    code: str
    title: str
    description: str
    iconUrl: Optional[str] = None
    unlockedAt: Optional[int] = None
    isUnlocked: bool

class ProfileStats(BaseModel):
    totalXp: int
    currentStreak: int
    longestStreak: int
    hearts: int
    gems: int

class UserProfileResponse(BaseModel):
    userId: str
    username: str
    joinedAt: int
    stats: ProfileStats
    achievements: List[ProfileAchievement]
