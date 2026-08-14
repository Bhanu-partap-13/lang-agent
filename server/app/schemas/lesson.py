from pydantic import BaseModel
from typing import List, Optional

class ExerciseBase(BaseModel):
    id: str
    lessonId: str
    order: int
    type: str
    prompt: str
    options: Optional[List[str]] = None
    correctAnswer: str | List[str]
    pairs: Optional[List[dict]] = None
    audioUrl: Optional[str] = None
    imageUrl: Optional[str] = None

    class Config:
        from_attributes = True

class LessonCompleteRequest(BaseModel):
    xpAwarded: int = 10
    heartsLost: int = 0
    mistakesCount: int = 0
    scorePct: int = 100

class LessonCompleteResponse(BaseModel):
    success: bool
    xpAwarded: int
    newTotalXp: int
    streakCount: int
    streakIncremented: bool
    heartsRemaining: int
