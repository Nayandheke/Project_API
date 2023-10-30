const { default: mongoose } = require('mongoose')
const { showError } = require("../../lib")
const { Place, Choice, Review } = require("../../models")
const { reviews } = require('../profile/profile.controller')

class PlaceController {
    top = async (req, res, next) => {
        try {
            const places = await Place.find({status:true}).sort({createdAt:'desc'}).exec()

            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }

    featured = async (req, res, next) => {
        try {
            const places = await Place.find({status:true, featured:true}).exec()

            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }

    most = async (req, res, next) => {
        try {
            const places = await Place.aggregate([
                {$match: {status:true}},
                {$lookup:{from:'boughtdetails', localField:'_id', foreignField:'placeId', as:'bought_count'}},
                {$addFields: {bought_count: {$size: '$bought_count'}}},
            ]).sort({'bought_count': 'desc'}).exec()

            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }

    byId = async (req, res, next) => {
        try {
            const place =  await Place.findOne({_id: req.params.id, status: true}).exec()

            if(place){
                const reviews = await Review.aggregate([
                    {$match: {placeId: new mongoose.Types.ObjectId(place._id)}},
                    {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'user'}}
                ]).exec()

                const result = reviews.map(review => {
                    return{
                        _id: review._id,
                        placeId: review.placeId,
                        userId: review.userId,
                        comment: review.comment,
                        rating: review.rating,
                        createdAt: review.createdAt,
                        updatedAt: review.updatedAt,
                        __v: review.__v,
                        user: review.user[0],
                    }
                })

                const choice = await Choice.findById(place.choiceId)

                res.json({
                    _id: place._id,
                    name: place.name,
                    summary: place.summary,
                    description: place.description,
                    price: place.price,
                    discounted_price: place.discounted_price,
                    images: place.images,
                    categoryId: place.categoryId,
                    choiceId: place.choiceId,
                    status: place.status,
                    featured: place.featured,
                    createdAt: place.createdAt,
                    updatedAt: place.updatedAt,
                    __v: place.__v,
                    reviews: result,
                    choice
                })
            }
            else{
                next({
                    Message: "Place not found.",
                    status: 404
                })
            }
            
        } catch (err) {
            showError(err, next)
            
        }
    }

    byCategoryId = async(req, res, next) => {
        try {
            const places = await Place.find({categoryId:req.params.id,status:true}).exec()

            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }

    byChoiceId = async(req, res, next) => {
        try {
            const places = await Place.find({choiceId:req.params.id,status:true}).exec()

            if(places) {
                res.json(places)
            } else {
                next({
                    message: 'Resourse not found.',
                    status:404,
                })
            }
        } catch (err) {
            showError(err, next)
        }
    }

    similar = async(req, res, next) => {
        try {
            const place = await Place.findOne({_id:req.params.id,status:true}).exec()

            if(place) {
                const places = await Place.find({categoryId:place.categoryId, status:true, _id: {$ne: place._id}}).exec()

                res.json(places)
            } else {
                next({
                    message: 'Resourse not found.',
                    status:404,
                })
            }
        } catch (err) {
            showError(err, next)
        }
    }

    search = async(req, res, next) => {
        try {
            const places = await Place.aggregate([
                {$match: {status: true, name:{$regex: req.query.term, $options: 'i'}}}
            ]).exec()

            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }
}

module.exports = new PlaceController