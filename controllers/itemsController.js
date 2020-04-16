exports.new = (req, res) => {
    render_params = {};
    render_params['title'] = 'New Article';

    res.render('items/new', render_params);
};