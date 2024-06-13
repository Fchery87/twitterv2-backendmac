import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    }
});

userSchema.index({username: 1});

export default new mongoose.model('User', userSchema);