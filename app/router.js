const express = require('express');
const saveController = require('./controllers/saveController');
const router = express.Router();


router.get('/save/:id', saveController.buildSave);

module.exports = router;