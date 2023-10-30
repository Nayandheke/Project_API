const {Schema, model} = require('mongoose')

const Bought = model('Bought', new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ['Processing', 'Confirmed'],
        default: 'Processing',
    }
},{
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
})
)

module.exports = Bought