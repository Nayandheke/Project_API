const express = require('express')
const {Front} = require('../../controllers')

const router = express.Router()

router.get('/categories', Front.ListCtrl.categories )
router.get('/categories/:id', Front.ListCtrl.categoryById )
router.get('/choices', Front.ListCtrl.choices )
router.get('/choices/:id', Front.ListCtrl.choiceById )

module.exports = router