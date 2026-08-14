from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Drizzle generates client/sqlite.db
    # We use a relative path assuming the server runs from c:\duolingo\server
    # and the db is at c:\duolingo\client\sqlite.db
    # We can override this with an env var
    DATABASE_URL: str = "sqlite:///../client/local.db"
    

    TURSO_AUTH_TOKEN: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
