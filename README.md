# README

## Tasks

Install dependencies.
```sh
./bin/mise run init
```

Build packages.
```sh
./bin/mise run build
```

Test packages.
```sh
./bin/mise run test
```

Commit changes for release.
```sh
git -C './@downforce/<package>' add --all .
git -C './@downforce/<package>' commit --edit --message '[@downforce/<package>] <message>'
```

Publish package to NPM registry.
```sh
./bin/npm login
./bin/publish-npm version|patch|minor|major ./@downforce/<package> ...
```

Publish package to JSR registry.
```sh
./bin/publish-jsr version|patch|minor|major ./@downforce/<package> ...
```

Clean packages outputs.
```sh
./bin/mise run clean
```

Clean packages outputs.
```sh
./bin/pnpm clean --lockfile
```

Clean Git repository.
```sh
git clean -X -d -f .
```
