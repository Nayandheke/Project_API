const jwt = require('jsonwebtoken')
const { User } = require('../models')

const showError = (error , next) => {
    console.log(error)
    next({
        message:'Problem while processing request.',
        status:400
    })
}

const auth = async(req,res,next) => {
    if('authorization' in req.headers){
        const token = req.headers.authorization.split(' ').pop()
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id)
            if(user){
                if(user.status){
                    req.user = user
                    next()
                }
                else{
                    next({ 
                        message: 'Inactive account.',
                        status: 403
                    })
                }
            }
            else{
                throw Error('No user')
            }
        } catch (err) {
            next({ 
                message: 'Invalid Token.',
                status: 401
            })
        }
    }
    else{
        next({ 
            message: 'Token missing.',
            status: 401
        })
    }
}

const cmsUser = async(req, res, next) => {
    if(req.user.type != 'Customer') {
        next()
    } else {
        next ({
            message: 'Access denied',
            status: 403,
        })
    }
}

const adminUser = async(req, res, next) => {
    if(req.user.type == 'Admin') {
        next()
    } else {
        next ({
            message: 'Access denied',
            status: 403,
        })
    }
}

module.exports = {showError, auth, cmsUser, adminUser}