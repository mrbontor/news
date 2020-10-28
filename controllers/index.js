const iniParser = require('../libs/iniParser')
const logging = require('../libs/logging')
const request = require('../libs/needleRequest')
const util = require('../libs/utils')

const searchSchema    = JSON.parse(fs.readFileSync('./schema/schema.json'))

let config = iniParser.get()

const SUCCESS           = 200
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const INTERNAL_ERROR    = 500
const ARTICLES = `/svc/search/v2/articlesearch.json`

const options = {
    'follow_max': 5
}

let body = {
    'api-key':config.nytimes.key,
}

let response = {status: false, message: "Data Not Found", data: [], meta:{}}

async function searchArticle(req, res) {
    try {
        body.q = req.params.q || ""
        body.sort = req.params.sort || "newest"
        let getData = await request('GET', ARTICLES, body)
        if (null === getData) return res.status(404).send(response)

        if (typeof getData.status === undefined || getData.status !== 'OK') return res.status(404).send(response)

        response = {
            status: true,
            message: 'Success',
            data: getData.response.docs,
            meta: getData.response.meta
        }
        res.status(SUCCESS).send(response)
    } catch (e) {
        response.message = 'something went wrong'
        return res.status(400).send(response)
    }
}


module.exports = {
    searchArticle
};
