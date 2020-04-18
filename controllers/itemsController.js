const mysql = require('./api/mysql_helper');

exports.new = (req, res) => {
    let render_params = {};
    render_params['title'] = 'Create new item';

    res.render('items/new', render_params);
};

exports.index = (req, res) => {
    let render_params = {};
    render_params['title'] = 'Index of items';

    let sql = 'SELECT * FROM items';
    mysql.connection.query(sql, (err, results, fields) => {
        render_params['results'] = results;
        res.render('items/index', render_params);
    });
};

exports.test = (req, res, next) => {
    render_params = {};
    render_params['title'] = "Test";
    res.render('test', render_params);
}

exports.test2 = (req, res, next) => {
    console.log('ID: ', req.params.id)
    if (req.params.id === '0')
        next('route')
    else
        next()
}

exports.test3 = (req, res, next) => {
    console.log('ID in test3: ', req.params.id);
    res.end(req.params.id);
}