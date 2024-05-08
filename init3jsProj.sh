#!/bin/bash

set -e

projectName=$1

if [ -z "$projectName" ]; then
  echo "Usage: $0 <projectName>"
  exit 1
fi

# if not exists .gitingore, download Node.gitignore
if [ ! -f .gitignore ]; then
    wget https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore -O .gitignore
fi


# append .DS_Store to .gitignore
echo ".DS_Store" >> .gitignore
# append *.swp to .gitignore
echo "*.swp" >> .gitignore

# create project directory
mkdir -p $projectName

cd $projectName

# if not exist package.json, npm init
if [ ! -f package.json ]; then
  npm init -y
fi

# install parcel for development
if [ ! -d node_modules/parcel ]; then
  npm install --save-dev parcel
fi

