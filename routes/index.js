const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller')

console.log('router loaded');

// 
router.get('/' , homeController.home )
//this router handles users request
router.use('/users' , require('./users'))
router.use('/posts', require('./posts') );

//for any furthur routes, access from here
//router.use('/routerName' , require('./routerfile'))

module.exports = router;