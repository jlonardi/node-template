# node-template

Basic node application ment to be a template for a node app which uses Auth0 and Postgresql. Ment to be forked for other projects in order to avoid writing the necessary boilerplate.

## Development

The following are the instrocution to make the run the appication on your local machine

### Database

The database is Postgres and runs in a docker container. To start the database run

```
npm run start-database
```

or alternatively

```
docker-compose up -d db
```

### Application

To run the application in watch-mode for development

```
npm run dev
```

and go to http://localhost:3000

## Building

To build the project for example for deployment

```
npm run build
```

The application can be run inside a docker container. The containers are build using `Dockerfile`. To run the app with docker

```
docker-compose up -d ui
```
