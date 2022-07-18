#!/bin/sh

VERSION=$1
MESSAGE="chore(release): $1"

echo -e "\nBump package version…"
npm version --git-tag-version false $VERSION

echo -e "\nCommit changes…"
git add --all
git commit --message "$MESSAGE"

echo -e "\nCreate tag…"
git tag --sign --message "$MESSAGE" $VERSION
