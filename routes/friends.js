const express = require('express');

const router = express.Router();

const friendsController = require('../controllers/friends_Controller');

router.post('/toggle',friendsController.toggleFriend);

module.exports = router;