const iniParser = require('../libs/iniParser')
const logging = require('../libs/logging')
const request = require('../libs/needleRequest')
const util = require('../libs/utils')
const fs = require('fs')
const Ajv = require('ajv')

let config = iniParser.get()

const articleSchema    = JSON.parse(fs.readFileSync('./schema/article.json'))
const ebookSchema    = JSON.parse(fs.readFileSync('./schema/ebook.json'))

//show All error if data not valid
const ajv = new Ajv({
    allErrors: false,
    loopRequired: Infinity
}); // options can be passed, e.g. {allErrors: true}

const SUCCESS           = 200
const BAD_REQUEST       = 400
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const INTERNAL_ERROR    = 500

const ARTICLES = `/svc/search/v2/articlesearch`
const EBOOK = `/svc/books/v3/lists`
const EBOOK_LIST = `/names`
const EBOOK_HARDCOVER_FICTION = `/hardcover-fiction`

const options = {
    'follow_max': 5
}

const body = {
    'api-key':config.nytimes.key,
}

let response = {status: false, message: "Data Not Found"}

async function searchArticle(req, res) {
    try {
        body.q = req.params.q || ""
        body.sort = req.params.sort || "newest"

        let isRequestValid = await createRequest(body, 'article')
        logging.debug(`[isRequestValid] >>>> TRUE =>FALSE || FALSE => TRUE ${JSON.stringify(isRequestValid)}`)

        if (isRequestValid.message){
            response.message = "sorting value should be equal to one of the allowed values"
            response.errors = isRequestValid.message.message
            return res.status(BAD_REQUEST).send(response);
        }

        let getData = await request('GET', ARTICLES, body)
        if (null === getData) return res.status(NOT_FOUND).send(response)

        if (typeof getData.status === undefined || getData.status !== 'OK') return res.status(NOT_FOUND).send(response)

        response = {
            status: true,
            message: 'Success',
            data: getData.response.docs,
            meta: getData.response.meta
        }
        res.status(SUCCESS).send(response)
    } catch (e) {
        logging.error(`[searchArticle] >>>> ${JSON.stringify(e.stack)}`)
        response.message = 'something went wrong'
        return res.status(BAD_REQUEST).send(response)
    }
}

async function getListsEbook(req, res) {
    try {
        let getData = await request('GET', EBOOK + EBOOK_LIST, body)
        if (null === getData) return res.status(NOT_FOUND).send(response)

        if (typeof getData.status === undefined || getData.status !== 'OK') return res.status(NOT_FOUND).send(response)

        response = {
            status: true,
            message: 'Success',
            data: getData.results
        }
        res.status(SUCCESS).send(response)
    } catch (e) {
        logging.error(`[getListsEbook] >>>> ${JSON.stringify(e.stack)}`)
        response.message = 'something went wrong'
        return res.status(BAD_REQUEST).send(response)
    }
}

async function searchEbook(req, res) {
    try {
        body.date = req.params.date || 'current/'
        console.log(date);
        // if(typeof date )
        let getData = await request('GET', EBOOK +'/'+ date + EBOOK_HARDCOVER_FICTION, body)
        if (null === getData) return res.status(NOT_FOUND).send(response)

        if (typeof getData.status === undefined || getData.status !== 'OK') {
            response.message = getData.errors[0]
            return res.status(BAD_REQUEST).send(response)
        }

        response = {
            status: true,
            message: 'Success',
            data: getData.results
        }
        res.status(SUCCESS).send(response)
    } catch (e) {
        logging.error(`[searchEbook] >>>> ${JSON.stringify(e.stack)}`)
        response.message = 'something went wrong'
        return res.status(BAD_REQUEST).send(response)
    }
}

async function createRequest(type) {
    let result = {}
    let valid
    switch (type) {
        case 'ebook':
            valid = ajv.validate(ebookSchema, type);
            break;
        default:
            valid = ajv.validate(articleSchema, type)
    }
    logging.debug(`[ValidateRequest] >>>> ${JSON.stringify(ajv.errors)}`)

    if (!valid) {
        result = util.handleErrorValidation(ajv.errors);
    }
    return Promise.resolve(result);
}

module.exports = {
    searchArticle,
    getListsEbook,
    searchEbook
};
