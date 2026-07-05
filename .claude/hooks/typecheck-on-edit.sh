#!/usr/bin/env bash
# PostToolUse hook: after an Edit/Write to a TS/TSX source file, run a project
# typecheck so type regressions surface immediately (this repo has no test suite).
#
# Reads the tool payload from stdin (JSON). Only fires for .ts/.tsx edits under src/.
# Non-blocking: reports diagnostics via exit 2 (stderr shown to Claude) but never
# hard-fails the session. tsc is fast enough here (small codebase, incremental build).
set -euo pipefail

payload="$(cat)"

# Extract the edited file path (works for Edit and Write) without requiring jq.
file="$(printf '%s' "$payload" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*:"([^"]+)"/\1/')"

case "$file" in
  *src/*.ts|*src/*.tsx) ;;                 # proceed
  *) exit 0 ;;                             # not a source edit — skip
esac

cd "${CLAUDE_PROJECT_DIR:-.}"

if ! out="$(npx tsc --noEmit 2>&1)"; then
  # exit 2 surfaces stderr to Claude as actionable feedback without killing the turn.
  echo "typecheck failed after editing ${file}:" >&2
  echo "$out" | tail -40 >&2
  exit 2
fi

exit 0
