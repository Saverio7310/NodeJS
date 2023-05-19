const express = require('express')

const controller = require('../controllers/main_page_con')
const auth = require('../middleware/isAuth')

const router = express.Router()

router.get('/', controller.getAddUser)

router.post('/addUser', controller.postAddUser)

router.post('/searchUser', auth, controller.postSearchUser)

router.delete('/delete/:userID', controller.deleteUser)

//router.post('/logout_button', controller.postLogOut)

module.exports = router