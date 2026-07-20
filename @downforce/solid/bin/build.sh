#!/usr/bin/env sh

set -eu

case "$(dirname "$0")" in
    /*|./*) Dir=$(cd "$(dirname "$0")" && pwd);;
    *) Dir=$(cd "$PWD/$(dirname "$0")" && pwd);;
esac

ProjectDir=$(cd "$Dir/.." && pwd)
RepositoryDir=$(cd "$Dir/../../.." && pwd)

export PATH="$ProjectDir/node_modules/.bin:$RepositoryDir/bin:$PATH"

cd "$ProjectDir"
set -x
babel "$ProjectDir/ts/" --out-dir "$ProjectDir/esm/" --extensions '.ts,.tsx'
tsc --project "$ProjectDir/tsconfig.json"
tsc --project "$ProjectDir/tests/tsconfig.json"
