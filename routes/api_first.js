const express = require('express')

const controller = require('../controllers/api_con')

const router = express.Router()

router.get('/first', controller.getFirst)

module.exports = router