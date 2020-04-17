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