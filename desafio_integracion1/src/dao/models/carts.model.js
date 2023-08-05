import mongoose from 'mongoose';

const cartCollection = 'Carts';

const cartSchema = new mongoose.Schema({
   
    products: {
        type:[
            {
                _id:{
                    type: mongoose.Types.ObjectId,
                    ref: 'Products'
                },
                quantity:{
                    type: Number,
                    default:1
                }
            }
        ],
        default:[]
    }
}, 
{

    timestamps: true,
}
);


cartSchema.index({ 'products._id': 1 });

export const cartModel = mongoose.model(cartCollection, cartSchema)
