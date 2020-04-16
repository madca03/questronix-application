const express = require('express');
const router = express.Router();

const items_controller = require('../controllers/api/itemsController.js');

router.get('/articles', items_controller.index);
router.get('/article/:id', items_controller.show);
router.post('/article', items_controller.new);
router.put('/article/:id', items_controller.update);
router.delete('/article/:id', items_controller.destroy);

module.exports = router;