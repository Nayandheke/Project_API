const express = require('express')
const { Cms } = require('../../controllers')
const {uploadFile} = require('../../lib')

const router = express.Router()

const mimeList = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

router.route('/')
    .get(Cms.PlacesCtrl.index)
    .post(uploadFile(mimeList).array('images'),Cms.PlacesCtrl.store)

router.route('/:id')
    .get(Cms.PlacesCtrl.show)
    .put(uploadFile(mimeList).array('images'),Cms.PlacesCtrl.update)
    .patch(uploadFile(mimeList).array('images'),Cms.PlacesCtrl.update)
    .delete(Cms.PlacesCtrl.destroy)


module.exports = router