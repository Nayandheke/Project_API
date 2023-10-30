const {Schema, model} = require('mongoose')

const BoughtDetail = model('BoughtDetail', new Schema({
    boughtId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    placeId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required : true
    },
    total: {
        type: Number,
        required: true,
    }
},{
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
})
)

module.exports = BoughtDetail