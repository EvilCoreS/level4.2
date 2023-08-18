## First time installation
```bash
 # npm ci
 $ make install
 
 # run this for create .env
 $ make copy-env
 # go to .env file and fill all variables
```

```bash
 # when everything is ready
 # run this for start building image
 $ make docker-build
```

## Running the app

```bash
# up docker containers
$ make docker-up
```

## Database management

```bash
# start migrations
$ make migrate

# delete migrations
$ make rollback

# generate migrations
$ make generate

#linux-only fast update migration file and start migrate
# use it when you update or create new entity
$ make re-migrate
```

## eslint --fix
```bash
$ make format
```
