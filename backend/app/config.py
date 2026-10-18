from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HF_TOKEN: str = ""
    FRONTEND_URL: str = "https://your-app.vercel.app"
    LLM_MODEL: str = "Qwen/Qwen2.5-7B-Instruct"
    class Config:
        env_file = ".env"

settings = Settings()