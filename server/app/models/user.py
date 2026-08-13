# server/app/models.py
# SQLAlchemy models matching schema.sql — for use with FastAPI + SQLite

from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    display_name = Column(String)
    avatar_url = Column(String)
    timezone = Column(String, default="UTC")
    xp_total = Column(Integer, nullable=False, default=0)
    gems = Column(Integer, nullable=False, default=500)
    hearts = Column(Integer, nullable=False, default=5)
    hearts_max = Column(Integer, nullable=False, default=5)
    hearts_refill_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_active_at = Column(DateTime)


class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    flag_icon = Column(String)


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    learning_language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    from_language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    color_theme = Column(String, default="#58CC02")

    units = relationship("Unit", back_populates="course", cascade="all, delete")


class UserCourse(Base):
    __tablename__ = "user_courses"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True)
    is_active = Column(Boolean, nullable=False, default=False)
    enrolled_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    color_theme = Column(String, default="#1CB0F6")

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    icon = Column(String)
    description = Column(Text)
    max_level = Column(Integer, nullable=False, default=5)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, nullable=False)
    lesson_type = Column(String, nullable=False, default="practice")

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, autoincrement=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, nullable=False)
    exercise_type = Column(String, nullable=False)
    prompt = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    options_json = Column(Text)
    audio_url = Column(String)
    image_url = Column(String)

    lesson = relationship("Lesson", back_populates="exercises")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    level = Column(Integer, nullable=False, default=0)
    xp_earned = Column(Integer, nullable=False, default=0)
    is_unlocked = Column(Boolean, nullable=False, default=False)
    last_practiced_at = Column(DateTime)


class LessonCompletion(Base):
    __tablename__ = "lesson_completions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    score_pct = Column(Integer, nullable=False)
    mistakes_count = Column(Integer, nullable=False, default=0)
    xp_earned = Column(Integer, nullable=False, default=0)
    completed_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False)
    lesson_completion_id = Column(Integer, ForeignKey("lesson_completions.id", ondelete="CASCADE"))
    user_answer = Column(Text)
    is_correct = Column(Boolean, nullable=False)
    attempted_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Streak(Base):
    __tablename__ = "streaks"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    current_streak = Column(Integer, nullable=False, default=0)
    longest_streak = Column(Integer, nullable=False, default=0)
    last_practice_date = Column(Date)
    streak_freeze_count = Column(Integer, nullable=False, default=0)


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)
    criteria_type = Column(String, nullable=False)
    criteria_value = Column(Integer, nullable=False)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), primary_key=True)
    earned_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class League(Base):
    __tablename__ = "leagues"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    tier_order = Column(Integer, nullable=False, unique=True)


class LeagueGroup(Base):
    __tablename__ = "league_groups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    league_id = Column(Integer, ForeignKey("leagues.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    week_end = Column(Date, nullable=False)


class LeagueParticipant(Base):
    __tablename__ = "league_participants"

    league_group_id = Column(Integer, ForeignKey("league_groups.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    xp_this_week = Column(Integer, nullable=False, default=0)
    rank = Column(Integer)


class Friendship(Base):
    __tablename__ = "friendships"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    friend_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class DailyQuest(Base):
    __tablename__ = "daily_quests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    xp_reward = Column(Integer, nullable=False)
    target_type = Column(String, nullable=False)
    target_value = Column(Integer, nullable=False)


class UserDailyQuest(Base):
    __tablename__ = "user_daily_quests"
    __table_args__ = (UniqueConstraint("user_id", "quest_id", "quest_date"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quest_id = Column(Integer, ForeignKey("daily_quests.id", ondelete="CASCADE"), nullable=False)
    quest_date = Column(Date, nullable=False)
    progress = Column(Integer, nullable=False, default=0)
    is_completed = Column(Boolean, nullable=False, default=False)