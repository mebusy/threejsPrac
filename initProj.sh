#!/bin/bash

set -e

projectName=$1

if [ -z "$projectName" ]; then
  echo "Usage: $0 <projectName>"
  exit 1
fi

# https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore > .gitignore
wget https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore -O .gitignore

# append .DS_Store to .gitignore
echo ".DS_Store" >> .gitignore
# append *.swp to .gitignore
echo "*.swp" >> .gitignore

# create project directory
mkdir -p $projectName
