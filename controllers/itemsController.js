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

exports.api_list = (req, res) => {
    let sql = 'SELECT id FROM items limit 1';
    render_params = {};

    mysql.connection.query(sql, (err, results, fields) => {
        console.log(results);
        if (results.length === 0) {
            render_params['id'] = '1';
        } else {
            render_params['id'] = results[0]['id'];
        }
        render_params['title'] = 'REST API list';
        render_params['hostname'] = req.get('host');
        res.render('items/api-list', render_params);    
    });

}