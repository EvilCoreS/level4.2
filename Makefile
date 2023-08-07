install:
	npm ci --force
copy-env:
	cp ./.env.example ./.env
edit-env:
	nano ./.env
migrate:
	npm run migration:run
rollback:
	npm run migration:revert
generate:
	npm run migration:generate
start:
	npm run start
start-dev:
	npm run start:dev
build:
	npm run build
format:
	npm run lint
preinstall-linux: copy-env edit-env install migrate
preinstall: copy-env install