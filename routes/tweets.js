import express from "express";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

const router = express.Router();

/**
 * Create a new Tweet
 * @method POST /tweets/
 * @description This route is used by the addTweet function in TweetList.jsx
 */
router.post("/", async (req, res) => {
  console.log(req.body);
  const { username, newTweet } = req.body;

  // check if user exists
  const dbUser = await User.findOne({ username });

  if (dbUser) {
    console.log(dbUser);

    const tweet = await Tweet.create({
      content: newTweet,
      user: dbUser._id,
      username: dbUser.username,
    });
    return res.json(tweet);
  } else {
    const newUser = await User.create({ username });
    console.log(newUser);

    const tweet = await Tweet.create({
      content: newTweet,
      user: newUser._id,
      username: newUser.username,
    });

    return res.json(tweet);
  }
});

/**
 * Fetch all tweets
 * @method GET /tweets/
 * @description This route is used by the useEffect in TweetList.jsx
 */
router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find();
    res.send(tweets);
  } catch (error) {
    res.json({ msg: error.message });
  }
});

/**
 * Deletes tweet by the id
 * @method Delete /tweets/:id
 * @param id
 * @description This route is used by the removeTweet in TweetList.jsx
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Tweet.findOneAndDelete(id);
    res.json({ msg: `Tweet with id: ${id} was deleted!` });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

/**
 * Updates tweets by the id
 * @method PUT /tweets/:id
 * @param id
 * @description This route is used by the updateTweet in TweetList.jsx
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { newTweetContent } = req.body;
  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      id,
      { content: newTweetContent },
      { new: true }
    );

    console.log(updatedTweet);
    res.json(updatedTweet);
  } catch (error) {
    res.json({ msg: error.message });
  }
});
/**
 * Like a tweet
 * @method PATCH /tweets/:id/like
 */
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

/**
 * Retweet a tweet
 * @method PATCH /tweets/:id/retweet
 */
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
