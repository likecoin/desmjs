#!/usr/bin/env bash

# Force stop the execution at the first error
set -e

# Absolute path of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Temporary directory where will be extracted the proto files
TMP_DIR="$SCRIPT_DIR/../tmp"

# Path where will be downloaded the desmos sources
ZIP_FILE="$SCRIPT_DIR/../desmos-source.zip"

# Directory where will be placed the proto files
PROTO_DIR="$SCRIPT_DIR/../proto-files"

# Url from where will be downloaded the desmos proto files
DESMOS_VERSION="5.0.0"
SRC_URL="https://github.com/desmos-labs/desmos/archive/refs/tags/v$DESMOS_VERSION.zip"

# Download the proto files
wget -q  --show-progress $SRC_URL -O "$ZIP_FILE"
# Create a temp dir where will be extracted the proto files
mkdir -p "$TMP_DIR"
# Get the proto from the zip
unzip -qq "$ZIP_FILE" "**.proto" -d "$TMP_DIR"
rm $ZIP_FILE

# Clear the directory where will be extracted the proto files
if [ -d $PROTO_DIR ]; then
  rm -R $PROTO_DIR
fi
mkdir $PROTO_DIR

# Mv the proto file into the proto dir
mv "$TMP_DIR/desmos-$DESMOS_VERSION/proto" $PROTO_DIR

# Install needed third party proto files by telescope
yarn telescope install @protobufs/cosmos @protobufs/cosmos_proto @protobufs/ibc

# Mv the proto files downloaded by telescope into the proto dir
find "proto" -mindepth 1 -maxdepth 1 -type d ! -name "desmjs" -exec mv -t "$PROTO_DIR/proto/" {} +

# Clean up tmp dir
rm -Rf $TMP_DIR

echo "Proto file obtained successfully!"
