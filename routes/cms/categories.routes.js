const express = require('express')
const { Cms } = require('../../controllers')

const router = express.Router()

router.route('/')
    .get(Cms.CategoriesCtrl.index)
    .post(Cms.CategoriesCtrl.store)

router.route('/:id')
    .get(Cms.CategoriesCtrl.show)
    .put(Cms.CategoriesCtrl.update)
    .patch(Cms.CategoriesCtrl.update)
    .delete(Cms.CategoriesCtrl.destroy)


module.exports = router