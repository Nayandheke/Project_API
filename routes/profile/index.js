const express = require('express')
const { ProfileCtrl } = require('../../controllers')

const router = express.Router()

router.get('/profile/details', ProfileCtrl.details)

router.put('/profile/edit', ProfileCtrl.profile)
router.patch('/profile/edit', ProfileCtrl.profile)

router.put('/profile/password', ProfileCtrl.password)
router.patch('/profile/password', ProfileCtrl.password)

router.post('/places/:id/review', ProfileCtrl.addReview)



module.exports = router