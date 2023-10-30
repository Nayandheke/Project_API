const { default: mongoose } = require("mongoose")
const { showError } = require('../../lib')
const { User, Review, Bought, BoughtDetail, Place } = require('../../models')
const bcrypt = require('bcryptjs')
const { show } = require("../cms/places.controller")
const Places = require("../../models/place.model")

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

    boughts = async( req, res, next) => {
        try {
            const boughts = await Bought.find({userId: req.user._id}).exec()

            const result = []

            for(let bought of boughts){
                const details = await BoughtDetail.aggregate([
                    {$match: {boughtId: new mongoose.Types.ObjectId(bought._id)}},
                    {$lookup: {from: 'places', localField: 'placeId', foreignField: '_id', as: 'place'}}
                ]).exec()

                const temp = details.map((details) => {
                    const places = details.places || []; // Check if 'places' is defined
                    return {
                        _id: details._id,
                        boughtId: details.boughtId,
                        placeId: details.placeId,
                        qty: details.qty,
                        price: details.price,
                        total: details.total,
                        createdAt: details.createdAt,
                        updatedAt: details.updatedAt,
                        __v: details.__v,
                        places: places.length > 0 ? places[0] : null, // Handle 'places' being empty
                    };
                });
                
            const user = bought.user || []; // Check if 'user' is defined
            result.push({
                _id: bought._id,
                userId: bought.userId,
                name:bought.name,
                status: bought.status,
                createdAt: bought.createdAt,
                updatedAt: bought.updatedAt,
                __v: bought.__v,
                details: temp,
            })
            }
                
            res.json(result)
            
        } catch (err) {
            showError(err,next)
        }
    }

    checkout = async( req, res, next) => {
        try {
            const cart = req.body
            const bought = await Bought.create({ userId: req.user._id })
            for (let item of cart) {
                const place = await Place.findById(item.placeId)
                const price = place.discounted_price ? place.discounted_price : place.price
                await BoughtDetail.create({
                    boughtId: bought._id,
                    placeId: item.placeId,
                    qty: item.qty,
                    price,
                    total: price * item.qty,
                    name: "Default Name" 
                });
            }
            res.json({
                success: "Thank you for your bought."
            })
        } catch (err) {
            showError(err, next)
        }
    }



}

module.exports = new ProfileController