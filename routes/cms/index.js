const express = require('express')
const staffsRoutes = require('./staffs.routes')
const customerRoutes = require('./customers.routes');
const categoriesRoutes = require("./categories.routes");
const { adminUser } = require('../../lib')

const router = express.Router()

router.use('/staffs', adminUser, staffsRoutes)
router.use("/customers", customerRoutes);
router.use("/categories", categoriesRoutes);

module.exports = router