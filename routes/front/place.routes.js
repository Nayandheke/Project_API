const express = require('express')
const {Front} = require('../../controllers')

const router = express.Router()

router.get('/places/top', Front.PlaceCtrl.top )
router.get('/places/featured', Front.PlaceCtrl.featured )
router.get('/places/most', Front.PlaceCtrl.most )
router.get('/places/search', Front.PlaceCtrl.search )
router.get('/places/:id', Front.PlaceCtrl.byId )
router.get('/categories/:id/places', Front.PlaceCtrl.byCategoryId )
router.get('/choices/:id/places', Front.PlaceCtrl.byChoiceId )
router.get('/places/:id/similar', Front.PlaceCtrl.similar )

module.exports = router