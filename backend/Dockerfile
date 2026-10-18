FROM python:3.11-slim

WORKDIR /app

# HF Spaces requires a non-root user
RUN useradd -m -u 1000 user
USER user

ENV PATH="/home/user/.local/bin:$PATH"

COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

COPY --chown=user ./app ./app

# HF Spaces default port is 7860
EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]