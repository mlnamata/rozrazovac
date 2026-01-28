#!/bin/bash
# Auto-commit and push changes

# Get current branch
branch=$(git rev-parse --abbrev-ref HEAD)

# Check if there are changes
if ! git diff-index --quiet HEAD --; then
  echo "📝 Committing changes..."
  git add -A
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  git commit -m "Auto-commit: $timestamp"
  
  echo "🚀 Pushing to GitHub on branch: $branch"
  git push origin $branch
  echo "✅ Done!"
else
  echo "No changes to commit"
fi
