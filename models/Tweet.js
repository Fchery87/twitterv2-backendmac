import mongoose from 'mongoose';
import { commentSchema } from './Comment.js';

const tweetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema], // nested documents
    content: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    likes: {
        type: Number,
        default: 0
    },
    retweets: {
        type: Number,
        default: 0
    },
}, {timestamps: true});

export default mongoose.model('Tweet', tweetSchema);
