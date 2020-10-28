const needle = require('needle')
const iniParser = require('./iniParser')
const logging = require('./logging')
const {genReff} = require('./utils')


function apiRequest(method, url, data = {}, options={}){
    let config = iniParser.get()
    let baseUrl = config.nytimes.url + `${url}.json`
    let reff = genReff()
    logging.info(`[NYTIMES-API][REQ][OUT] REFF: ${reff} ${method} ${baseUrl} ${JSON.stringify(data)} ${JSON.stringify(options)}`)
    return new Promise(function(resolve, reject) {
        needle.request(method, baseUrl, data, options, function(err, resp, body) {
            if (undefined === body) return reject(err)
            // if (resp.statusCode === 401) return reject(err)
            logging.info(`[NYTIMES-API][RES][IN] REFF: ${reff} ${resp.statusCode} ${JSON.stringify(body)}`)

            resolve(body)
        });
    });
}

module.exports = apiRequest;
