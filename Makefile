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
delete-migrations:
	rm database/migrations/*
seed-run:
	npm run seed:run
seed-config:
	npm run seed:config
start:
	npm run start
start-dev:
	npm run start:dev
build:
	npm run build
format:
	npm run lint
docker-build:
	docker compose build
docker-up:
	docker compose up -d
preinstall: copy-env install
re-migrate: rollback delete-migrations generate migrate