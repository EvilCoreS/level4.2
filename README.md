## First time installation
```bash
 # linux-only
 $ make preinstall-linux
```

```bash
 # or run this and fill variables in new .env
 $ make preinstall
 
 # after run migrations
 $ make migrate
```

## Running the app

```bash
# production
$ make start

# development mode
$ make start-dev
```

## Database management

```bash
# start migrations
$ make migrate

# delete migrations
$ make rollback

# generate migrations
$ make generate
```

## eslint --fix
```bash
$ make format
```
