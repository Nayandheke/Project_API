const { default: mongoose } = require("mongoose")
const { showError } = require("../../lib")
const { Review } = require("../../models")

class ReviewsController {
    index = async (req,res,next) => { 
        try {
            const reviews = await Review.aggregate([
                {$lookup: {from: 'places', localField: 'placeId', foreignField: '_id', as: 'place'}},
                {$lookup: {from: 'user', localField: 'userId', foreignField: '_id', as: 'user'}},
            ]).exec()
            const result = reviews.map(review => {
                return {
                    _id: review._id,
                    comment: review.comment,
                    rating: review.rating,
                    placeId: review.placeId,
                    userId: review.userId,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    __v: review.__v,
                    place: review.place[0],
                    user: review.user[0],
                }
            })
            res.json(
                result
            )
        } catch (err) {
            showError(err, next)
        }
    }

    destroy = async (req,res,next) => {
        try {
            const review = await Review.findByIdAndDelete(req.params.id)
            if(review){
                res.json({
                    success: 'Review removed.'
                })            
            }
            else{
                next({
                    message: 'Review not found',
                    status: 404
                })
            } 
        } catch (err) {
            showError(err, next)
        }
    }

}

module.exports = new ReviewsController