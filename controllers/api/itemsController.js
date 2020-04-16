exports.index = (req, res) => {
    response = {};
    response['route'] = 'index';
    res.json(response);
};

exports.show = (req, res) => {
    response = {};
    response['route'] = 'show';
    response['article_id'] = req.params.id;

    res.json(response);
};

exports.new = (req, res) => {
    response = {};
    response['route'] = 'new article';
    response['method'] = 'POST';
    res.json(response);
};

exports.update = (req, res) => {
    response = {};
    response['route'] = 'update';
    response['method'] = 'PUT';
    res.json(response);
};

exports.destroy = (req, res) => {
    response = {};
    response['route'] = 'destroy';
    response['method'] = 'DELETE';
    res.json(response);
};