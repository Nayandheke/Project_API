const {showError} = require("../../lib")
const { User } = require("../../models")
const bcrypt = require("bcryptjs")

class customersController {
    index = async(req,res,next) => {
        try {
            const customer = await User.find({type:'Customer'})
            res.json(customer)
        } catch (err) {
            showError(err, next)
        }
    }
    
    store = async(req,res,next) => {
        try {
            const {name, email, password, confirm_password, phone, address,} = req.body
            if(password == confirm_password){
                const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                await User.create({name, email, password: hash, phone, address})
                res.status(201).json({
                    success: 'Customer created.'       
                })
            }
            else{
                next({
                    message: 'Password not confirm.',
                    status: 422
                })
            }
        } 
        catch (err) {
            let message = {}
            if('errors' in err){
                for(let k in err.errors) {
                    message = {
                        ...message, [k]: err.errors[k].message
                    }
                }
            }
            else{
                if(err.message.startsWith('E11000')){
                    message = {
                        email: "Email already in use.",
                    }
                }
                else{
                    showError(err,next)
                }
            }
            next({
                message,
                status: 422
            })
            
        }
    }

    show = async (req,res,next) => {
        try {
            const customer = await User.findById(req.params.id)

            if(customer) {
                res.json(customer)
            }
            else{
                next({
                    message: 'Customer not found',
                    status: 404
                })
            }
            
        } catch (err) {
            showError(err, next)
        }
    }

    update = async (req,res,next) => {
        try {
            const {name, phone, address, status} = req.body

            const customer = await User.findByIdAndUpdate(req.params.id, {name, phone, address, status })

            if(customer) {
                res.json({
                    success: 'Customer updated.'
                })       
            }
            else{
                next({
                    message: 'Customer not found',
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
                if(err.message.startsWith('E11000')){
                    message = {
                        email: "Email already in use.",
                    }
                }
                else{
                    showError(err,next)
                }
            }
            next({
                message,
                status: 422
            })
            
        }
    }

    destroy = async (req,res,next) => {
        try {
            
            const customer = await User.findByIdAndDelete(req.params.id)
            if(customer){
                res.json({
                    success: 'Customer removed.'
                })            
            }
            else{
                next({
                    message: 'Customer not found',
                    status: 404
                })
            } 
        } catch (err) {
            showError(err, next)
        }
    }
}


module.exports = new customersController