import mongoose from 'mongoose';
import { commentSchema } from './Comment.js';

// const tweetDoc = {
//     content: newTweet,
//     username: "abe123",
//     likes: 0,
//     retweets: 0,
//     timestamp: new Date(),
//     id: uuidv4(),
//   };

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