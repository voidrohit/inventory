FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

FROM base AS builder

COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM base AS runtime

RUN groupadd --system app && useradd --system --gid app --create-home app

COPY --from=builder /install /usr/local
COPY . .

RUN chown -R app:app /app
USER app

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
