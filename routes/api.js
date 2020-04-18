const express = require('express');
const router = express.Router();

const items_controller = require('../controllers/api/itemsController.js');

router.get('/items', items_controller.index_api);
router.get('/item/:id', items_controller.show_api);
router.post('/item', items_controller.check_name_if_unique, items_controller.new_api);
router.put('/item/:id', items_controller.check_name_if_unique, items_controller.update_api);
router.delete('/item/:id', items_controller.destroy_api);

module.exports = router;