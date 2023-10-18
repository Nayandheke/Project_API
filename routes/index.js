const express = require('express')
const authRoutes = require('./auth')
const profileRoutes = require('./profile')
const cmsRoutes = require('./cms')
const frontRoutes = require('./front')
const { auth, cmsUser } = require('../lib')

const router = express.Router()

router.use(authRoutes)
router.use(frontRoutes)
router.use('/cms',auth,cmsUser, cmsRoutes)
router.use(auth, profileRoutes)


router.use((req, res, next) => {
    next({
        message:'Resourse not found.',
        status:404
    })
})

module.exports = router