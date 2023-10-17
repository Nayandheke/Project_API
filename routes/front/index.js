const express = require('express')
const placeRoutes = require('./place.routes')
const listRoutes = require('./list.routes')

const router = express.Router()

router.use(placeRoutes)

router.use(listRoutes)

module.exports = router