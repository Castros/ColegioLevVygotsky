#!/bin/bash

# Bulk publish script for Strapi collections
# Usage: ./bulk-publish.sh <collection-name> <api-token>
# Example: ./bulk-publish.sh testimonials your-api-token-here

COLLECTION=$1
API_TOKEN=$2
STRAPI_URL="https://cms.vigotskyreynosa.edu.mx"

if [ -z "$COLLECTION" ] || [ -z "$API_TOKEN" ]; then
    echo "Usage: ./bulk-publish.sh <collection-name> <api-token>"
    echo "Example: ./bulk-publish.sh testimonials your-token"
    exit 1
fi

echo "Fetching all entries from $COLLECTION..."

# Get all entries
ENTRIES=$(curl -s "$STRAPI_URL/$COLLECTION")

# Extract IDs and publish each one
echo "$ENTRIES" | grep -o '"id":[0-9]*' | cut -d':' -f2 | while read -r ID; do
    echo "Publishing entry ID: $ID"

    curl -X PUT "$STRAPI_URL/$COLLECTION/$ID" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"published_at\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}"

    echo ""
done

echo "Done!"
