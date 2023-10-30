const express = require('express')
const { Cms } = require('../../controllers')

const router = express.Router()

router.get('/',Cms.BoughtCtrl.index)


router.route('/:id')
    .put(Cms.BoughtCtrl.update)
    .patch(Cms.BoughtCtrl.update)
    .delete(Cms.BoughtCtrl.destroy)


module.exports = router