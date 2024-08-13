#!/bin/bash

rm index.html
rm music.ogg
cp build/index.html .
cp a/music.ogg .
rm game.zip
zip game.zip index.html music.ogg

advzip -z -4 game.zip
