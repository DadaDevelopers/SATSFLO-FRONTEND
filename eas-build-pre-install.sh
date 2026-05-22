#!/bin/bash

if [ -n "$GOOGLE_SERVICES_JSON" ]; then
  echo "Writing google-services.json from EAS secret..."
  echo "$GOOGLE_SERVICES_JSON" | base64 --decode > google-services.json
  echo "google-services.json written successfully"
else
  echo "WARNING: GOOGLE_SERVICES_JSON secret not found"
fi
