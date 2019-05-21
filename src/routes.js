const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const Post = require("./models/Post");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();
  return res.json(posts);
});

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const { originalname: name, size, key, location: url = "" } = req.file;

    const post = await Post.create({
      name,
      size,
      key,
      url
    });

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) return res.status(404).json({ error: "Post not found" });
  await post.remove();
  return res.send();
});

routes.put("/posts/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) return res.status(404).json({ error: "Post not found" });
  console.log(req.body);
  post.name = req.body.name;
  await post.save();
  return res.send();
});

module.exports = routes;
