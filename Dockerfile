# jeffery russell 12-19-2020

# --- Stage 1: Builder ---
FROM rust:1.75-slim-bookworm AS builder
RUN apt-get update && apt-get install -y gcc \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Switch to nightly Rust to support edition2024
RUN rustup install nightly && rustup default nightly

# Compile and install the binary
RUN cargo install gifski

# --- Stage 2: Runtime ---
FROM node:bookworm-slim
# Copy only the built binary from the builder stage
COPY --from=builder /usr/local/cargo/bin/gifski /usr/local/bin/gifski

WORKDIR /src/

COPY package.json package.json

RUN ls -la

# installs ffmpeg
RUN apt-get update && \
    apt-get install ffmpeg -y && \
    apt-get install wget -y

# installs node dependencies
RUN npm install

# exposes port application runs on
EXPOSE 4000

# launch command
CMD npm start