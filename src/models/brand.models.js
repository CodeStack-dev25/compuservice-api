import { Schema, model } from 'mongoose';

const brandSchema = new Schema({
    name: {
        type: String
    },
    urlBrand: {
        type: String
    }
})

export default model('brandClients', brandSchema);