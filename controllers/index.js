const AuthCtrl = require('./auth/auth.controller')
const ProfileCtrl = require('./profile/profile.controller')
const Cms = require('./cms')
const Front = require('./front')

module.exports = { AuthCtrl, Cms, Front, ProfileCtrl }