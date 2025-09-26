from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  DATABASE_URL: str
  DATABASE_URL: str
  JWT_SECRET: str
  JWT_EXPIRE_MINUTES: int = 15

  class Config: 
    env_file = ".env"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()