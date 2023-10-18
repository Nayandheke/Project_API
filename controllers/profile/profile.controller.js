const { showError } = require('../../lib')
const { User, Review } = require('../../models')
const bcrypt = require('bcryptjs')

class ProfileController {
    details = async( req, res, next) => {
        res.json(req.user)
    }

    profile = async( req, res, next) => {
        try {
            const {name, phone, address} = req.body

            const user = await User.findByIdAndUpdate(req.user._id, {name, phone, address })
            if(user) {
                res.json({
                    success: 'Profile updated.'
                })       
            }
            else{
                next({
                    message: 'User not found',
                    status: 404
                })
            }     
        } catch (err) {
            let message = {}
            if('errors' in err){
                for(let k in err.errors) {
                    message = {
                        ...message, [k]: err.errors[k].message
                    }
                }
            }
            else{
                showError(err,next)
            }
            next({
                message,
                status: 422
            })
            
        }
    }

    password = async( req, res, next) => {
        try {
            const {oldPassword, newPassword, confirmPassword} = req.body
             
            if(bcrypt.compareSync(oldPassword, req.user.password)) {
                if( newPassword == confirmPassword) {
                    const hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))

                    const user = await User.findByIdAndUpdate(req.user._id, {password: hash})
                if(user) {
                    res.json({
                        success: 'Password updated.'
                    })       
                }
                else{
                    next({
                        message: 'User not found',
                        status: 404
                    })
                }
                } else {
                    next({
                        message: 'Password not confirmed.',
                        status:422,
                    })
                }
            } else {
                next({
                    message: 'Old password is incorrect.',
                    status: 422,
                })
            }
        } catch (err) {
            let message = {}
            if('errors' in err){
                for(let k in err.errors) {
                    message = {
                        ...message, [k]: err.errors[k].message
                    }
                }
            }
            else{
                showError(err,next)
            }
            next({
                message,
                status: 422
            })
            
        }
    }

    bought = async( req, res, next) => {}

    checkout = async( req, res, next) => {}

    reviews = async( req, res, next) => {}

    addReview = async( req, res, next) => {
        try {
            const { rating, comment} = req.body

            await Review.create({rating, comment, userId: req.user._id, productId: req.params.id})

            res.json({
                success: 'Thank you for your review.'
            })

        } catch( err) {
            showError(err, next)
        }
    }
}

module.exports = new ProfileController