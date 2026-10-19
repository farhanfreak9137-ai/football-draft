# Self-Hosted Deployment Guide: Historical Football Draft Game

This document outlines the deployment, operations, maintenance, and backup procedures for deploying the Historical Football Draft game on a self-hosted Linux VPS (e.g., Ubuntu 22.04 / 24.04 LTS, Debian 12, or AlmaLinux 9).

---

## 1. System Requirements

- **CPU:** 1 vCPU (2+ vCPUs recommended for concurrent match simulations)
- **Memory:** 1 GB RAM minimum (2 GB recommended)
- **Disk:** 10 GB SSD / NVMe
- **Operating System:** Linux (Ubuntu 22.04/24.04 LTS, Debian 12)
- **Runtime:** Node.js 20+ LTS or Docker 24+ with Docker Compose v2

---

## 2. Architecture Overview

```
 [Client Web Browsers]
         │ (HTTPS / WSS)
         ▼
 ┌──────────────┐
 │  Nginx Proxy │ (Port 80/443 SSL termination, WebSocket upgrade)
 └──────┬───────┘
        │ (HTTP / WS on internal port 3001)
 ┌──────▼────────────────────────────────┐
 │ Node.js Express + WS Engine           │
 │  - /api/* (REST Endpoints)            │
 │  - /ws (State Synchronization)        │
 │  - Static Client (/dist/client)       │
 └──────┬────────────────────────────────┘
        │
 ┌──────▼────────────────────────────────┐
 │ Authoritative Storage                 │
 │  - Local SQLite / LibSQL (zero-dep)   │
 │  - or Managed PostgreSQL              │
 └───────────────────────────────────────┘
```

---

## 3. Deployment Option A: Docker Compose (Recommended)

### Prerequisites

Install Docker and Docker Compose on your VPS:
```bash
sudo apt update && sudo apt install -y curl git
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Setup and Launch

1. Clone your repository:
   ```bash
   git clone <your-repo-url> /opt/football-draft
   cd /opt/football-draft
   ```

2. Inspect or customize `.env`:
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=file:/app/data/prod.db
   ```

3. Build and launch services in background:
   ```bash
   docker compose up -d --build
   ```

4. Verify container health:
   ```bash
   docker compose ps
   curl -I http://localhost:80/api/health
   ```

---

## 4. Deployment Option B: Bare-Metal Systemd Service

### Build Steps

1. Install Node.js 20 LTS:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. Install dependencies and compile assets:
   ```bash
   cd /opt/football-draft
   npm ci
   npm run build:client
   npm run build:server
   ```

3. Configure systemd unit at `/etc/systemd/system/footballdraft.service`:
   ```ini
   [Unit]
   Description=Historical Football Draft Game Server
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/football-draft
   ExecStart=/usr/bin/node dist-server/server/index.js
   Restart=always
   RestartSec=5
   Environment=NODE_ENV=production
   Environment=PORT=3001
   Environment=DATABASE_URL=file:/opt/football-draft/data/prod.db

   [Install]
   WantedBy=multi-user.target
   ```

4. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now footballdraft
   sudo systemctl status footballdraft
   ```

---

## 5. Reverse Proxy with SSL (Certbot)

To secure client connections with HTTPS and WSS:

1. Install Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain Let's Encrypt certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. Ensure Nginx configuration includes WebSocket upgrade directives:
   ```nginx
   location /ws {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "Upgrade";
       proxy_set_header Host $host;
       proxy_read_timeout 3600s;
       proxy_send_timeout 3600s;
   }
   ```

---

## 6. Backup & Restore Procedures

### Database Backups (SQLite / LibSQL)

For SQLite/LibSQL deployments, create automated snapshots with `.backup`:

```bash
#!/bin/bash
# /opt/football-draft/scripts/backup.sh
BACKUP_DIR="/var/backups/footballdraft"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Safe non-blocking SQLite snapshot
sqlite3 /opt/football-draft/data/prod.db ".backup '$BACKUP_DIR/db_$TIMESTAMP.sqlite'"
gzip "$BACKUP_DIR/db_$TIMESTAMP.sqlite"

# Retain last 14 daily backups
find "$BACKUP_DIR" -type f -name "*.gz" -mtime +14 -delete
```

### PostgreSQL Dump & Restore (If Using Remote Postgres)

- **Backup:**
  ```bash
  pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE -F c -b -v -f /var/backups/pg_$(date +%F).dump
  ```
- **Restore:**
  ```bash
  pg_restore -h $PGHOST -U $PGUSER -d $PGDATABASE -v /var/backups/pg_<timestamp>.dump
  ```

---

## 7. Monitoring & Health Checks

- **Health check endpoint:** `GET /api/health`
  Returns HTTP 200 with JSON payload:
  ```json
  {
    "status": "healthy",
    "uptimeSeconds": 1420,
    "timestamp": 1729270000000,
    "activeRooms": 3
  }
  ```
- **Logs Inspection:**
  - Docker: `docker compose logs -f app`
  - Systemd: `journalctl -u footballdraft -f`

