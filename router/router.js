module.exports = function(app) {
    const router = require('../controllers');

    app.route('/api/article/search/:q/:sort')
        .get(router.searchArticle)

    app.get('/api/ping', function (req, res) {
        res.status(200).json({status: true, message: "How are you? i`m Fine. Thanks "})
    })
};
