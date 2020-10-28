module.exports = function(app) {
    const router = require('../controllers');

    app.route('/api/article/search/:q?/:sort?')
        .get(router.searchArticle)

    app.route('/api/ebook/lists/')
        .get(router.getListsEbook)

    app.route('/api/ebook/search/:date?')
        .get(router.searchEbook)

    app.get('/api/ping', function (req, res) {
        res.status(200).json({status: true, message: "How are you? i`m Fine. Thanks "})
    })
};
