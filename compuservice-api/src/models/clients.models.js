import { Schema, model } from 'mongoose';

const clientsSchema = new Schema({
    brand: {
        url: {
            type: String
        },
        public_id: {
            type: String
        },
    },
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    description: {
        type: String,
    },
    thumbnail: [
        {
            url: {
                type: String
            },
            public_id: {
                type: String
            },
        },
    ],
    hero: {
        url: {
            type: String
        },
        public_id: {
            type: String
        },
    },
},
    {
        strict: false,
        timestamps: true,
        versionKey: false
    });

export default model('client', clientsSchema);