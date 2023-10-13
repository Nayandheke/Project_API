const {Schema, model} = require('mongoose')

const Places = model('Places', new Schema({ 
    name: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discounted_price: {
        type: Schema.Types.Mixed,
        required: false,
    },
    images:{
        type: [String],
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    brandId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
})
)

module.exports = Places