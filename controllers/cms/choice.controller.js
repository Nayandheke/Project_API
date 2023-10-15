const {showError, validationError} = require("../../lib")
const {Choice } = require("../../models")

class ChoiceController {
    index = async(req,res,next) => {
        try {
            const choices = await Choice.find()
            res.json(choices)
        } catch (err) {
            showError(err, next)
        }
    }
    
    store = async(req,res,next) => {
        try {
            const {name, status} = req.body
                await Choice.create({name, status})
                res.status(201).json({
                    success: 'Choice created.'       
                })
        } 
        catch (err) {
            validationError(err,next)
        }
    }

    show = async (req,res,next) => {
        try {
            const choice = await Choice.findById(req.params.id).exec()

            if(choice) {
                res.json(choice)
            }
            else{
                next({
                    message: 'Choice not found',
                    status: 404
                })
            }
            
        } catch (err) {
            showError(err, next)
        }
    }

    update = async (req,res,next) => {
        try {
            const {name, status} = req.body

            const choice = await Choice.findByIdAndUpdate(req.params.id, {name, status })

            if(choice) {
                res.json({
                    success: 'Choice updated.'
                })       
            }
            else{
                next({
                    message: 'Choice not found',
                    status: 404
                })
            }     
        } catch (err) {
            validationError(err,next)
        }
    }

    destroy = async (req,res,next) => {
        try {
            
            const choice = await Choice.findByIdAndDelete(req.params.id)
            if(choice){
                res.json({
                    success: 'Choice removed.'
                })            
            }
            else{
                next({
                    message: 'Choice not found',
                    status: 404
                })
            } 
        } catch (err) {
            showError(err, next)
        }
    }
}


module.exports = new ChoiceController