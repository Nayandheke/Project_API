const {Schema,model } = require('mongoose')

const Choice = model('Choice', new Schema({
    name: {
        type:String,
        required: true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    
},{
    timestamps:true,
    autoIndex:true,
    autoCreate:true,
})
)

module.exports = Choice