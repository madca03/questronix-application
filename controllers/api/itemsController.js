const mysql = require('./mysql_helper');

exports.index_api = (req, res) => {
    let response = {};

    let sql = `SELECT * FROM items;`;
    mysql.connection.query(sql, (err, results, fields) => {
        if (err == null) {
            response['status'] = 'success';
        } else {
            response['status'] = 'unsuccessful';
        }

        response['err'] = err;
        response['results'] = results;
        res.json(response);
    });
};

exports.show_api = (req, res) => {
    let item_id = req.params.id;

    let response = {}

    let sql = `SELECT * FROM items WHERE id = ${item_id}`;
    mysql.connection.query(sql, (err, results, fields) => {
        if (err == null) {
            response['status'] = 'success';
        } else {
            response['status'] = 'unsuccessful';
        }

        response['err'] = err;
        response['results'] = results;
        res.json(response);
    });
};

exports.check_name_if_unique = (req, res, next) => {
    let item_id = req.params.id;
    let name = req.body.name;

    let response = {};
    let sql = `SELECT COUNT(*) AS name_count FROM items WHERE name = '${name}' AND id != ${item_id}`;
    mysql.connection.query(sql, (err, results, fields) => {
        if (err != null) {
            response['status'] = 'unsuccessful';
            response['err'] = err;
            res.json(response);
        } else {
            if (results[0]['name_count'] == 0) {
                next();
            } else {
                response['status'] = 'unsuccessful';
                response['err'] = 'name already exists';
                res.json(response);
            }
        }
    });
}

exports.new_api = (req, res, next) => {
    let name = req.body.name;
    let qty = req.body.qty;
    let amount = req.body.amount;
    
    let response = {}
    if ((name === undefined) || (qty === undefined) || (amount === undefined)) {
        response['status'] = 'unsuccessful';
        response['err'] = [];
        if (name === undefined)
            response['err'].push('invalid item name');
        if (qty === undefined)
            response['err'].push('invalid item quantity');
        if (amount === undefined)
            response['err'].push('invalid item amount');
        
        res.json(response);
    } else {
        let sql = `INSERT INTO items (name, qty, amount) VALUES ('${name}', ${qty}, ${amount})`;
        mysql.connection.query(sql, (err, results, fields) => {
            if (err == null) {
                response['status'] = 'success';
            } else {
                response['status'] = 'unsuccessful';
            }
    
            response['err'] = err;
            response['results'] = results;
            response['fields'] = fields;
            
            console.log(results);
            console.log(fields);
            res.json(response);
        });
    }
};

exports.update_api = (req, res) => {
    let item_id = req.params.id;
    let name = req.body.name;
    let qty = req.body.qty;
    let amount = req.body.amount;
    let response = {};

    if ((name === undefined) || (qty === undefined) || (amount === undefined)) {
        response['status'] = 'unsuccessful';
        response['err'] = [];
        if (name === undefined)
            response['err'].push('invalid item name');
        if (qty === undefined)
            response['err'].push('invalid item quantity');
        if (amount === undefined)
            response['err'].push('invalid item amount');
        
        res.json(response);
    } else {
        let sql = `UPDATE items SET name = '${name}', qty = ${qty}, amount = ${amount} WHERE id = ${item_id};`;
        mysql.connection.query(sql, (err, results, fields) => {
            if (err == null) {
                response['status'] = 'success';
            } else {
                response['status'] = 'unsuccessful';
            }

            response['err'] = err;
            response['results'] = results;
            response['fields'] = fields;
            
            res.json(response);
        });
    }
};

exports.destroy_api = (req, res) => {
    let item_id = req.params.id;

    let response = {};

    let sql = `DELETE FROM items WHERE id = ${item_id}`;
    mysql.connection.query(sql, (err, results, fields) => {
        if (err == null) {
            response['status'] = 'success';
        } else {
            response['status'] = 'unsuccessful';
        }

        response['err'] = err;
        response['results'] = results;
        response['fields'] = fields;
        
        res.json(response);
    });
};