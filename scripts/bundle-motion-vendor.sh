#!/bin/sh
# Rebuilds vendor/motion.min.js from the pinned vendor files.
# GSAP 3.15.1 (gsap, ScrollTrigger, SplitText — free under the GSAP
# "no charge" standard license, https://gsap.com/standard-license) and
# Lenis 1.3.27 (MIT). One file = one request on every page.
set -e
cd "$(dirname "$0")/.."
{
  echo "/*! motion.min.js — GSAP 3.15.1 + ScrollTrigger + SplitText (gsap.com/standard-license) + Lenis 1.3.27 (MIT). Built by scripts/bundle-motion-vendor.sh */"
  for f in vendor/gsap/gsap.min.js vendor/gsap/ScrollTrigger.min.js vendor/gsap/SplitText.min.js vendor/lenis.min.js; do
    sed '/sourceMappingURL/d' "$f"; echo ";"
  done
} > vendor/motion.min.js
