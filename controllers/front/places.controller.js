const { showError } = require("../../lib")
const { Place } = require("../../models")

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
                {$lookup:{from:'mostdetails', localField:'_id', foreignField:'placeId', as:'bought_count'}},
                {$addFields: {bought_count: {$size: '$bought_count'}}},
            ]).sort({'bought_count': 'desc'}).exec()

            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }

    byId = async(req, res, next) => {
        try {
            const place = await Place.findOne({_id:req.params.id,status:true}).exec()

            res.json(place)
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