import mongoose from 'mongoose';

const collection = "Messages";

const schema = new mongoose.Schema({
   
    user: {
        type: String,
        required: true,  
    },
   
    message: {
        type: String,
        required: true,  
    }
}, 
{
    
    timestamps: true,
}
);

const messageModel = mongoose.model(collection, schema);

export default messageModel;
