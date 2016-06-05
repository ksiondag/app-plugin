
module.exports = function (express) {
    const app = express();

    app.get('/', function (req, res) {
        res.send('Dynamic');
    });

    return app;
};

