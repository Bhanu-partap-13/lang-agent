from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Boolean, DateTime
from app.core.database import Base
from datetime import datetime

# ============ CONTENT ============

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    from_language = Column(String, nullable=False)
    target_language = Column(String, nullable=False)
    icon_url = Column(String)

class Unit(Base):
    __tablename__ = "units"
    id = Column(String, primary_key=True)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    order = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    color_theme = Column(String, default="green")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(String, primary_key=True)
    unit_id = Column(String, ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    order = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    icon_url = Column(String)
    max_crowns = Column(Integer, nullable=False, default=5)
    prerequisite_skill_ids = Column(JSON, default=[])

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(String, primary_key=True)
    skill_id = Column(String, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    order = Column(Integer, nullable=False)
    type = Column(String, nullable=False, default="new")
    crown_level = Column(Integer, nullable=False, default=1)

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(String, primary_key=True)
    lesson_id = Column(String, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    order = Column(Integer, nullable=False)
    type = Column(String, nullable=False)
    prompt = Column(String, nullable=False)
    options = Column(JSON)
    correct_answer = Column(JSON, nullable=False)
    pairs = Column(JSON)
    audio_url = Column(String)
    image_url = Column(String)

# ============ USER PROFILE & GAMIFICATION ============

class UserProfile(Base):
    __tablename__ = "user_profile"
    user_id = Column(String, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    active_course_id = Column(String, ForeignKey("courses.id"))
    created_at = Column(Integer, nullable=False)

class UserStats(Base):
    __tablename__ = "user_stats"
    user_id = Column(String, primary_key=True)
    total_xp = Column(Integer, nullable=False, default=0)
    current_streak = Column(Integer, nullable=False, default=0)
    longest_streak = Column(Integer, nullable=False, default=0)
    last_activity_date = Column(String)
    streak_freeze_count = Column(Integer, nullable=False, default=0)
    hearts = Column(Integer, nullable=False, default=5)
    max_hearts = Column(Integer, nullable=False, default=5)
    last_heart_lost_at = Column(Integer)
    gems = Column(Integer, nullable=False, default=500)
    daily_goal_xp = Column(Integer, nullable=False, default=20)
    updated_at = Column(Integer, nullable=False)

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    user_id = Column(String, primary_key=True)
    skill_id = Column(String, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    status = Column(String, nullable=False, default="locked")
    crowns = Column(Integer, nullable=False, default=0)
    xp_earned = Column(Integer, nullable=False, default=0)
    last_practiced_at = Column(Integer)

class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    lesson_id = Column(String, ForeignKey("lessons.id"), nullable=False)
    started_at = Column(Integer, nullable=False)
    completed_at = Column(Integer)
    status = Column(String, nullable=False, default="in_progress")
    hearts_lost = Column(Integer, nullable=False, default=0)
    xp_awarded = Column(Integer, nullable=False, default=0)

class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"
    id = Column(String, primary_key=True)
    lesson_attempt_id = Column(String, ForeignKey("lesson_attempts.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(String, ForeignKey("exercises.id"), nullable=False)
    user_answer = Column(JSON)
    is_correct = Column(Boolean, nullable=False)
    time_taken_ms = Column(Integer)

class DailyActivity(Base):
    __tablename__ = "daily_activity"
    user_id = Column(String, primary_key=True)
    date = Column(String, primary_key=True)
    xp_earned = Column(Integer, nullable=False, default=0)
    lessons_completed = Column(Integer, nullable=False, default=0)
    chest_claimed = Column(Boolean, nullable=False, default=False)

# ============ ACHIEVEMENTS ============

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(String, primary_key=True)
    code = Column(String, nullable=False, unique=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon_url = Column(String)
    criteria = Column(JSON, nullable=False)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    user_id = Column(String, primary_key=True)
    achievement_id = Column(String, ForeignKey("achievements.id"), primary_key=True)
    unlocked_at = Column(Integer, nullable=False)