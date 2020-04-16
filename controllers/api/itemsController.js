const mysql = require('./mysql_helper');

exports.index_api = (req, res) => {
    response = {};
    response['route'] = 'index';
    res.json(response);
};

exports.show_api = (req, res) => {
    response = {};
    response['route'] = 'show';
    response['article_id'] = req.params.id;

    res.json(response);
};

exports.new_api = (req, res) => {

    let name = req.body.name;
    let qty = req.body.qty;
    let amount = req.body.amount;

    response = {}

    let sql = `INSERT INTO items (name, qty, amount) VALUES ('${name}', ${qty}, ${amount})`;
    mysql.connection.query(sql, (err, results, fields) => {
        response['results'] = results;
        response['fields'] = fields;
        
        console.log(results);
        console.log(fields);
        res.json(response);
    });

};

exports.update_api = (req, res) => {
    response = {};
    response['route'] = 'update';
    response['method'] = 'PUT';
    res.json(response);
};

exports.destroy_api = (req, res) => {
    response = {};
    response['route'] = 'destroy';
    response['method'] = 'DELETE';
    res.json(response);
};