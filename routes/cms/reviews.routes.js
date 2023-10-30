const express = require('express')
const { Cms } = require('../../controllers')

const router = express.Router()

router.get('/',Cms.ReviewsCtrl.index)

router.delete('/:id',Cms.ReviewsCtrl.destroy)


module.exports = router