const express = require('express');
const router = express.Router();

const items_controller = require('../controllers/api/itemsController.js');

router.get('/articles', items_controller.index_api);
router.get('/article/:id', items_controller.show_api);
router.post('/article', items_controller.new_api);
router.put('/article/:id', items_controller.update_api);
router.delete('/article/:id', items_controller.destroy_api);

module.exports = router;