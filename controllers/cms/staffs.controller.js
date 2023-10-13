const {showError} = require("../../lib")
const { User } = require("../../models")
const bcrypt = require("bcryptjs")

class staffsController {
    index = async(req,res,next) => {
        try {
            const staffs = await User.find({type:'Staff'})
            res.json(staffs)
        } catch (err) {
            showError(err, next)
        }
    }
    
    store = async(req,res,next) => {
        try {
            const {name, email, password, confirm_password, phone, address, status} = req.body
            if(password == confirm_password){
                const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                await User.create({name, email, password: hash, phone, address,status, type: 'Staff'})
                res.status(201).json({
                    success: 'Staff created.'       
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
            const staff = await User.findById(req.params.id)

            if(staff) {
                res.json(staff)
            }
            else{
                next({
                    message: 'Staff not found',
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

            const staff = await User.findByIdAndUpdate(req.params.id, {name, phone, address, status })

            if(staff) {
                res.json({
                    success: 'Staff updated.'
                })       
            }
            else{
                next({
                    message: 'Staff not found',
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

    destroy = async (req,res,next) => {
        try {
            
            const staff = await User.findByIdAndDelete(req.params.id)
            if(staff){
                res.json({
                    success: 'Staff removed.'
                })            
            }
            else{
                next({
                    message: 'Staff not found',
                    status: 404
                })
            } 
        } catch (err) {
            showError(err, next)
        }
    }
}


module.exports = new staffsController