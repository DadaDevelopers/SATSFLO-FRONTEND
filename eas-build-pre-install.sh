#!/bin/bash
echo "Pre-install hook running..."
echo "google-services.json present: $(test -f google-services.json && echo YES || echo NO)"
