FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies (useful if you ever need standard psycopg2 or tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt.txt

# Copy backend source tree
COPY . /app/

EXPOSE 8000

# The actual start command is handled by docker-compose.yml,
# but this acts as a safe fallback.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
