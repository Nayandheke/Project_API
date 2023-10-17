const express = require('express')
const authRoutes = require('./auth')
const cmsRoutes = require('./cms')
const frontRoutes = require('./front')
const { auth, cmsUser } = require('../lib')

const router = express.Router()

router.use(authRoutes)
router.use(frontRoutes)
router.use('/cms',auth,cmsUser, cmsRoutes)


router.use((req, res, next) => {
    next({
        message:'Resourse not found.',
        status:404
    })
})

module.exports = router