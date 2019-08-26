const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

const UsersModel = mongoose.model('User', UserSchema);
module.exports = UsersModel;