const fs = require('fs');
const iniParser = require('./libs/iniParser')
const logging = require('./libs/logging')
const args = require('minimist')(process.argv.slice(2));
const bodyParser = require('body-parser')
const express = require('express')
const env = process.env.NODE_ENV || 'development'

const app = express()

process.env.TZ = 'Asia/Jakarta'
// default config if config file is not provided

const NODE_ENV = process.env.NODE_ENV || 'development'
let config = {
    log: {
        path: "var/log/",
        level: "debug"
    }
}

if (args.h || args.help) {
    // TODO: print USAGE
    console.log("Usage: node " + __filename + " --config");
    process.exit(-1);
}

// Select default config file from NODE_ENV
let defaultConfigFile = (NODE_ENV === 'production') ? './configs/config.api.prod.ini' : './configs/config.api.dev.ini'

// overwrite default config with config file
configFile = args.c || args.config || defaultConfigFile
config = iniParser.init(config, configFile, args)

config.log.level = args.logLevel || config.log.level
const take_port = config.app.port;
const port = take_port || process.env.PORT;

logging.init({
    path: config.log.path,
    level: config.log.level
})

logging.info('[app] STARTED')
logging.info('[arguments] ' + JSON.stringify(NODE_ENV))
logging.info('[config] ' + JSON.stringify(config))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    if (err) {
        logging.error('[MIDDLEWAREERROR] ' + JSON.stringify(err));
        res.status(500);
        let response = {
            status: 500,
            errors: [err.message]
        };
        res.json(response);
    } else {
        next();
    }
});

const routes = require('./router/router');
routes(app);

app.use(function (req, res, next) {
    let respons = {status: false, message: "Not Found"}
    res.status(404).json(respons);
});

app.listen(port);
logging.info('[app] API-NYTIMES STARTED on ' + port);
