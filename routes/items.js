const express = require('express');
const router = express.Router();

const items_controller = require('../controllers/itemsController.js');

router.get(['/', '/articles'], items_controller.index);
router.get('/api-list', items_controller.api_list);
module.exports = router;