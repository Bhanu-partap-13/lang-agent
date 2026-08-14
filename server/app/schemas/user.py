from pydantic import BaseModel
from typing import Optional, List

class UserStatsResponse(BaseModel):
    userId: str
    totalXp: int
    currentStreak: int
    longestStreak: int
    lastActivityDate: Optional[str]
    streakFreezeCount: int
    hearts: int
    maxHearts: int
    lastHeartLostAt: Optional[int]
    gems: int
    dailyGoalXp: int
    updatedAt: int

    class Config:
        from_attributes = True
        populate_by_name = True

class DailyActivityResponse(BaseModel):
    userId: str
    date: str
    xpEarned: int
    lessonsCompleted: int
    chestClaimed: bool

    class Config:
        from_attributes = True

class SimulateXpRequest(BaseModel):
    xp: int

class SimulateXpResponse(BaseModel):
    success: bool
    xpAdded: int
    newTotalXp: int

class ClaimChestResponse(BaseModel):
    success: bool
    gemsAwarded: int
    heartsAwarded: int
    newGemsTotal: int
    newHeartsTotal: int

class ChestEligibilityResponse(BaseModel):
    isEligible: bool
    alreadyClaimed: bool
    currentXp: int
