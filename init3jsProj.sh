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

# create index.html
htmlTmpleate='
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3js</title>
  </head>
  <body>
    <script src="./js/scripts.js" type="module"></script>
  </body>
</html>
'
echo "$htmlTmpleate" > index.html

# create scripts.js
mkdir -p js

echo '' > js/scripts.js


