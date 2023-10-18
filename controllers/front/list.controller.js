const { Category, Choice } = require("../../models")

class ListController {
    categories = async(req, res, next) => {
        try {
            const categories = await Category.find({
                status: true
            }).exec()

            res.json(categories)
            
        } catch (err) {
            showError(err,next)
            
        }
    }

    categoryById = async(req, res, next) => {
        try {
            const category = await Category.findById({_id: req.params.id, status: true}).exec()

            if(category){
                res.json(category)
            }
            else{
                next({
                    Message: "Category not found",
                    status: 404
                })
            }  
        } catch (err) {
            showError(err,next)
            
        }
    }

    choices = async(req, res, next) => {
        try {
            const choices = await Choice.find({
                status: true
            }).exec()

            res.json(choices)
            
        } catch (err) {
            showError(err,next)
            
        }
    }

    choiceById = async(req, res, next) => {
        try {
            const choices = await Choice.findById({_id: req.params.id, status: true}).exec()

            if(choices){
                res.json(choices)
            }
            else{
                next({
                    Message: "Choice not found",
                    status: 404
                })
            }  
        } catch (err) {
            showError(err,next)
            
        }
    }
} 

module.exports = new ListController