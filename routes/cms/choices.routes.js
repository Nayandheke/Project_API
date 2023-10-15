const express = require('express')
const { Cms } = require('../../controllers')

const router = express.Router()

router.route('/')
    .get(Cms.ChoicesCtrl.index)
    .post(Cms.ChoicesCtrl.store)

router.route('/:id')
    .get(Cms.ChoicesCtrl.show)
    .put(Cms.ChoicesCtrl.update)
    .patch(Cms.ChoicesCtrl.update)
    .delete(Cms.ChoicesCtrl.destroy)


module.exports = router