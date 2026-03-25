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
exec node --test --test-reporter ${NODE_TEST_REPORTER:-spec} --enable-source-maps "$ProjectDir/tests/**/*.test.ts"
