#!/usr/bin/env bash
# add-to-droplet.sh — Add this client's Strapi to a shared droplet that already
# has Traefik + other clients running.
#
# Usage (run from project root):
#   ./scripts/add-to-droplet.sh <DROPLET_IP> <CLIENT_NAME> [env-file]
#
# Example:
#   ./scripts/add-to-droplet.sh 68.183.109.131 caferey cms/.env.staging
#
# Prerequisites:
#   - Droplet has Docker + a running Traefik on the strapi_strapi-net network
#   - DNS A record for STRAPI_DOMAIN already points to DROPLET_IP
#   - env-file has all required vars (see cms/.env.example)

set -euo pipefail

DROPLET_IP="${1:-}"
CLIENT_NAME="${2:-}"
ENV_FILE="${3:-cms/.env.staging}"
TRAEFIK_NETWORK="${4:-strapi_strapi-net}"
COMPOSE_FILE="docker-compose.shared.yml"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=5"
SSH_BUILD_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=5 -o ServerAliveInterval=30 -o ServerAliveCountMax=20"

if [[ -z "$DROPLET_IP" || -z "$CLIENT_NAME" ]]; then
  echo "Usage: $0 <DROPLET_IP> <CLIENT_NAME> [env-file] [traefik-network]"
  echo "Example: $0 68.183.109.131 caferey cms/.env.staging strapi_strapi-net"
  echo "Example: $0 128.199.7.34 vigotskyreynosa cms/.env.prod web"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌  Env file not found: $ENV_FILE"
  echo "    Copy cms/.env.example → $ENV_FILE and fill in values first."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌  $COMPOSE_FILE not found — run this script from the project root."
  exit 1
fi

STRAPI_DOMAIN=$(grep '^STRAPI_DOMAIN=' "$ENV_FILE" | cut -d= -f2)
REMOTE_DIR="/opt/strapi/${CLIENT_NAME}"

echo "🚀  Adding ${CLIENT_NAME} to shared droplet at ${DROPLET_IP}..."
echo "    Domain: ${STRAPI_DOMAIN}"
echo "    Remote: ${REMOTE_DIR}"
echo ""

# ── Step 1: Verify SSH ────────────────────────────────────────────────────────
echo "⏳  Checking SSH..."
for i in $(seq 1 12); do
  if ssh $SSH_OPTS root@$DROPLET_IP "echo ok" >/dev/null 2>&1; then
    echo "   ✓ SSH ready"
    break
  fi
  if [ $i -eq 12 ]; then
    echo "❌  Cannot reach $DROPLET_IP over SSH."
    exit 1
  fi
  sleep 5
done

# ── Step 2: Verify Docker ─────────────────────────────────────────────────────
echo "🔍  Verifying Docker..."
ssh $SSH_OPTS root@$DROPLET_IP "docker --version && docker compose version" || {
  echo "❌  Docker not found on this droplet."
  exit 1
}
echo "   ✓ Docker ready"

# ── Step 3: Verify shared Traefik network exists ──────────────────────────────
echo "🔍  Checking for ${TRAEFIK_NETWORK} network..."
ssh $SSH_OPTS root@$DROPLET_IP "docker network inspect ${TRAEFIK_NETWORK}" >/dev/null 2>&1 || {
  echo "❌  Network ${TRAEFIK_NETWORK} not found on this droplet."
  echo "    Check available networks: ssh root@$DROPLET_IP 'docker network ls'"
  exit 1
}
echo "   ✓ ${TRAEFIK_NETWORK} exists"

# ── Step 4: Verify / create swap ─────────────────────────────────────────────
SWAP=$(ssh $SSH_OPTS root@$DROPLET_IP "swapon --show --noheadings | wc -l")
if [ "$SWAP" -gt 0 ]; then
  echo "   ✓ Swap active"
else
  echo "⚠️   No swap — adding 2 GB (required for Strapi admin build)..."
  ssh $SSH_OPTS root@$DROPLET_IP "
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    sysctl vm.swappiness=10
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
  "
  echo "   ✓ Swap created"
fi

# ── Step 5: Create directories + copy files ───────────────────────────────────
echo "📁  Setting up ${REMOTE_DIR}..."
ssh $SSH_OPTS root@$DROPLET_IP "mkdir -p ${REMOTE_DIR}/uploads ${REMOTE_DIR}/postgres"

echo "📦  Copying files..."
scp $SSH_OPTS "$ENV_FILE" root@$DROPLET_IP:${REMOTE_DIR}/.env
scp $SSH_OPTS "$COMPOSE_FILE" root@$DROPLET_IP:${REMOTE_DIR}/docker-compose.shared.yml
rsync -az --exclude=node_modules --exclude=.git --exclude=data -e "ssh $SSH_OPTS" cms/ root@$DROPLET_IP:${REMOTE_DIR}/cms/
echo "   ✓ Files copied"

# ── Step 6: Build and start ───────────────────────────────────────────────────
echo "🐳  Building and starting ${CLIENT_NAME} stack..."
echo "    First build takes 5-10 min (npm ci + Strapi admin compilation)"
echo ""
ssh $SSH_BUILD_OPTS root@$DROPLET_IP "
  cd ${REMOTE_DIR}
  CLIENT_NAME=${CLIENT_NAME} TRAEFIK_NETWORK=${TRAEFIK_NETWORK} docker compose -f docker-compose.shared.yml --env-file .env up -d --build
"

echo ""
echo "✅  Done! ${CLIENT_NAME} is deploying."
echo ""
echo "Watch logs:  ssh root@${DROPLET_IP} 'docker logs ${CLIENT_NAME}-strapi -f'"
echo "Admin:       https://${STRAPI_DOMAIN}/admin"
echo ""
echo "⚠️  Make sure DNS A record for ${STRAPI_DOMAIN} points to ${DROPLET_IP}"
