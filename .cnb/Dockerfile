FROM node:22-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git python3 \
    && rm -rf /var/lib/apt/lists/* \
    && node --version \
    && npm --version

WORKDIR /workspace
