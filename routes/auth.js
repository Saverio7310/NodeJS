const express = require('express')

const controller = require('../controllers/auth_con')

const router = express.Router()

router.get('/auth', controller.getAuth)

router.post('/signup', controller.postSignUp)

router.get('/login', controller.getLogIn)

router.post('/login', controller.postLogIn)

router.post('/logout', controller.postLogOut)

module.exports = router