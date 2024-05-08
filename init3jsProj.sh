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
    # append .DS_Store to .gitignore
    echo ".DS_Store" >> .gitignore
    # append *.swp to .gitignore
    echo "*.swp" >> .gitignore
fi

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

mkdir -p src

# create index.html
htmlTmpleate='
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3js</title>
    <style>
      body {
        margin: 0
      }
    </style>
  </head>
  <body>
    <script src="./js/scripts.js" type="module"></script>
  </body>
</html>
'
echo "$htmlTmpleate" > src/index.html

# create scripts.js
mkdir -p src/js

# if not exist 

if [ ! -f src/js/scripts.js ]; then

echo "
import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


" > src/js/scripts.js

fi  # end if not  scripts.js

# now install three.js if not exists
if [ ! -d node_modules/three ]; then
  npm install three
fi

# add a script to package.json
# "start": "parcel src/index.html" if not exists
if ! grep -q '"start": "parcel src/index.html"' package.json; then
  sed -i '' 's/"scripts": {/"scripts": {\n    "start": "parcel src\/index.html",/' package.json
fi

