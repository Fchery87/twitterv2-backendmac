// routes/tweets.js
import express from "express";
import multer from "multer";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";
import path from "path";
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/", upload.single('image'), async (req, res) => {
  const { username, content } = req.body;
  const imagePath = req.file ? req.file.path : null;

  const dbUser = await User.findOne({ username });

  if (dbUser) {
    const tweet = await Tweet.create({
      content,
      user: dbUser._id,
      username: dbUser.username,
      image: imagePath,
    });
    return res.json(tweet);
  } else {
    const newUser = await User.create({ username });
    const tweet = await Tweet.create({
      content,
      user: newUser._id,
      username: newUser.username,
      image: imagePath,
    });
    return res.json(tweet);
  }
});

router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 }); // Sort by creation date in descending order
    res.send(tweets);
  } catch (error) {
    res.json({ msg: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTweet = await Tweet.findByIdAndDelete(id);
    if (!deletedTweet) {
      return res.status(404).json({ msg: "Tweet not found" });
    }
    res.json({ msg: `Tweet with id: ${id} was deleted!` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { newTweetContent } = req.body;
  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      id,
      { content: newTweetContent },
      { new: true }
    );

    res.json(updatedTweet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.patch("/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({ msg: "Tweet not found" });
    }
    tweet.likes += 1;
    await tweet.save();
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.patch("/:id/retweet", async (req, res) => {
  const { id } = req.params;
  try {
    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({ msg: "Tweet not found" });
    }
    tweet.retweets += 1;
    await tweet.save();
    res.json(tweet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
