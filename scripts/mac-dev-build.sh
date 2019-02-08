#!/bin/bash
echo 'Packaging dev build'

electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./build/icons/mac/ara_dev.icns \
--prune=true \
--out=release-builds \
--app-bundle-id=\"com.ara.one.araFileManager\"

electron-osx-sign ./release-builds/Ara\ File\ Manager-darwin-x64/Ara\ File\ Manager.app/ --identity='Developer ID Application: Little Star Media, Inc. (HXEASF63SW)'