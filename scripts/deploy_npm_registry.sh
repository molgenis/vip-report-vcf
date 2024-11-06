#!/usr/bin/env bash
git diff # debug
pnpm config set registry "https://registry.npmjs.org"
pnpm config set //registry.npmjs.org/:_authToken "${NPM_TOKEN}"
pnpm publish .