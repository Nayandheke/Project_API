const { default: mongoose } = require("mongoose")
const { showError } = require('../../lib')
const { User, Review } = require('../../models')
const bcrypt = require('bcryptjs')
const { show } = require("../cms/places.controller")

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

    reviews = async( req, res, next) => {
        try {
            const reviews = await Review.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
                { $lookup: { from: 'places', localField: 'placeId', foreignField: '_id', as: 'place'}}
            ]).exec()

            const result = reviews.map(review => {
                return {
                    "_id": review._id,
                    "comment": review.comment,
                    "rating": review.rating,
                    "placeId": review.placeId,
                    "userId": review.userId,
                    "createdAt": review.createdAt,
                    "updatedAt": review.updatedAt,
                    "__v": review.__v,
                    place: review.place[0],
                }
            })

            res.json(result)
        } catch (err) {
            showError(err, next)
        }
    }

    addReview = async( req, res, next) => {
        try {
            const { rating, comment} = req.body

            await Review.create({rating, comment, userId: req.user._id, placeId: req.params.id})

            res.json({
                success: 'Thank you for your review.'
            })

        } catch( err) {
            showError(err, next)
        }
    }

    bought = async( req, res, next) => {}

    checkout = async( req, res, next) => {
        try {
            
        } catch (err) {
            showError( err, next)
        }
    }



}

module.exports = new ProfileController