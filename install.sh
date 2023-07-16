#!/bin/bash

if command -v apt >/dev/null; then
  apt update && apt install -y pkg-config libxml2-dev libxmlsec1-dev libxmlsec1-openssl
else
  echo "Do not pre-build"
fi