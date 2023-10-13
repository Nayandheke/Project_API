const express = require('express')
const staffsRoutes = require('./staffs.routes')
const { adminUser } = require('../../lib')

const router = express.Router()

router.use('/staffs', adminUser, staffsRoutes)

module.exports = router