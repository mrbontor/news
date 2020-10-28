# news
Integrating API NYtimes


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Features

* search news
* search ebook

by default, the response each request will get response

````
{
    status: Boolean,
    message: String
    data: Object || Array
}
````

> ### _**LIST URI**_

* *GET*    /api/ping
>>> `to check if this service is on (StatusCode: 200) or not (StatusCode: 500). `


* *GET*    /api/article/search/:q?/sort:?
>>> `this uri is used to search articles`

```
params :
{
    "q": "string",      | optional
    "sort": "enum"      | optional, by default is newest
}

```

* *GET*    /api/ebook/lists
>>> `this uri is used to get lists ebook fiction`

```
params :null
```

* *GET*    /api/ebook/search/:date?
>>> `this uri is used to search ebook hardcover fiction`

```
params :
{
    "date": "string",   | optional, by default is current
}
```

### Prerequisites

What things you need to install the software and how to install them

* [NODE JS](https://nodejs.org/) - JavaScript runtime environment
* [Express](https://expressjs.com/) - The web framework used
* [Needle Js](https://github.com/tomas/needle) - The leanest and most handsome HTTP client in the Nodelands.
* [AJV](https://github.com/ajv-validator/ajv) - A JSON Schema Validator
* [winston](https://github.com/winstonjs/winston) - A logger to monitoring about everything.

### Installing

```
git clone
npm install --save
node index.js --config=/path/to/configs/file --logLevel=info,

or u can just input

node index.js
```

The default path for config file is `./configs/config.api.dev.ini`, you can explicitly add config file in `--config` or `-c` argument.

### Configuring

[app]
host	= 0.0.0.0
port	= 2020

; log Configuration
[log]
path            = var/log/
level           = debug

[nytimes]
url             = https://api.nytimes.com
key             = yd0pOD0JdgP6rZTHKWjQfV1ACJ2YLsdx
secret          = nl6tz2WlIHi57G9k

### Running as a Service

This module is running in the foreground, to run it as a background service please add `2>&1 &` following the command. So it would be like:

```sh
node index.js --config=/path/to/config/file --logLevel=info 2>&1 &
```

Or you can utilize Linux systemd (if you are a Linux user). Create systemd file in `/etc/systemd/system`:
```
[Unit]
Description=News NYTimes

[Service]
ExecStart=/path/to/node /app/index.js
Restart=always
User=nobody
# Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/app

[Install]
WantedBy=multi-user.target
```

## Running the tests

No tests yet. You can add yourself as a contributior and make it by yourself. We would appreciate it a lot.

## Deployment

This app has `Dockerfile` to deploy it in docker system. Build image and run it as a container:

```sh
docker build --tag news-nytimes
docker run --rm news-nytimes
```

You can also use `docker-compose` to deploy it. Create a `yaml` configuration:

```yaml
version: '2'
services:
  news-nytimes:
    build: .
    container_name: news-nytimes
    volumes:
      - /volumes/news-nytimes/log:/app/var/log
networks:
  default:
    external:
      name: network_name

```

Change `network_name` to the name of your docker network


You can also monitor any request to service . Open terminal(linux)/bash - cmd(windows)

```
tail -f var/log/logApiNYtimes.log
```


## Contributing

Please contact your team leader for details of the process for submitting pull requests to us.

## Acknowledgments

* NY Times


## to be continue...
