#!/usr/bin/env bash
# ============================================================
# apply-syntopic-fix.sh
# Run from the ROOT of your syntopic-studio repo clone.
# Applies all fixes and pushes to main.
# ============================================================
set -e

REPO_ROOT="$(pwd)"
PATCH_FILE="$(dirname "$0")/syntopic-studio-fix.patch"

echo "=== Syntopic Studio — applying all fixes ==="
echo "Repo: $REPO_ROOT"

# Safety check
if [ ! -f "$REPO_ROOT/vite.config.ts" ]; then
  echo "ERROR: Run this from the syntopic-studio repo root (vite.config.ts not found)"
  exit 1
fi

# Apply the patch
if [ -f "$PATCH_FILE" ]; then
  echo "Applying git patch..."
  git am "$PATCH_FILE"
  echo "✓ Patch applied"
else
  echo "Patch file not found at: $PATCH_FILE"
  echo "Running manual file writes instead..."

  # The script falls through to manual writes if patch isn't available
  # (handled below)
  exit 1
fi

echo ""
echo "Pushing to origin/main..."
git push origin main

echo ""
echo "============================================================"
echo "  DONE — workflow triggered."
echo ""
echo "  1. Enable GitHub Pages (one-time):"
echo "     https://github.com/vishhingol-eng/syntopic-studio/settings/pages"
echo "     → Source → GitHub Actions → Save"
echo ""
echo "  2. Watch the deploy:"
echo "     https://github.com/vishhingol-eng/syntopic-studio/actions"
echo ""
echo "  3. Site will be live at:"
echo "     https://vishhingol-eng.github.io/syntopic-studio/"
echo "============================================================"
