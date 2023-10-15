const {showError, validationError} = require("../../lib")
const {Place } = require("../../models")
const { unlinkSync } = require("node:fs")

class PlaceController {
    index = async(req,res,next) => {
        try {
            const places = await Place.find()
            res.json(places)
        } catch (err) {
            showError(err, next)
        }
    }
    
    store = async (req, res, next) => {
        try {
            const { name, summary, description, price, discounted_price, categoryId, choiceId, featured, status } = req.body

            let images = req.files.map(file => file.filename)

            await Place.create({ name, summary, description, price, discounted_price, categoryId, choiceId, featured, status, images })
            res.status(201).json({
                success: 'Place created.'
            })
        }
        catch (err) {
            validationError(err, next)
        }
    }

    show = async (req,res,next) => {
        try {
            const place = await Place.findById(req.params.id).exec()

            if(place) {
                res.json(place)
            }
            else{
                next({
                    message: 'Place not found',
                    status: 404
                })
            }
            
        } catch (err) {
            showError(err, next)
        }
    }

    update = async (req,res,next) => {
        try {
            const {name, summary, descripition, price, discounted_price, categoryId, choiceId, featured, status} = req.body

            let place = await Place.findById(req.params.id);

            let images = [
                ...place.images,
                ...req.files.map(file => file.filename)
            ]

            const places = await Place.findByIdAndUpdate(req.params.id, {name, summary, descripition, price, discounted_price, categoryId, choiceId, featured, status })

            if(places) {
                res.json({
                    success: 'Place updated.'
                })       
            }
            else{
                next({
                    message: 'Place not found',
                    status: 404
                })
            }     
        } catch (err) {
            validationError(err,next)
        }
    }

    destroy = async (req,res,next) => {
        try {
            let place = await Place.findById(req.params.id);

            for(let image of place.images) {
                unlinkSync(`uploads/${image}`)
            }

            place = await Place.findByIdAndDelete(req.params.id)
            if(place){
                res.json({
                    success: 'Place removed.'
                })            
            }
            else{
                next({
                    message: 'Place not found',
                    status: 404
                })
            } 
        } catch (err) {
            showError(err, next)
        }
    }
}


module.exports = new PlaceController