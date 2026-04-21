const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "posts.json");
const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

function readPostsFromFile() {
  try {
    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

function savePostsToFile(posts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
}

app.get("/api", (req, res) => {
  res.send("Simple Blog API is running");
});

app.get("/api/posts", (req, res) => {
  const posts = readPostsFromFile();
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const posts = readPostsFromFile();
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
});

app.post("/api/posts", (req, res) => {
  const posts = readPostsFromFile();
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const highestId = posts.reduce((maxId, item) => {
    return item.id > maxId ? item.id : maxId;
  }, 0);

  const newPost = {
    id: highestId + 1,
    title,
    content,
  };

  posts.push(newPost);
  savePostsToFile(posts);

  res.status(201).json(newPost);
});

app.put("/api/posts/:id", (req, res) => {
  const posts = readPostsFromFile();
  const id = Number(req.params.id);
  const { title, content } = req.body;
  const postIndex = posts.findIndex((item) => item.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  posts[postIndex] = {
    id,
    title,
    content,
  };

  savePostsToFile(posts);

  res.json(posts[postIndex]);
});

app.delete("/api/posts/:id", (req, res) => {
  const posts = readPostsFromFile();
  const id = Number(req.params.id);
  const postIndex = posts.findIndex((item) => item.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(postIndex, 1);
  savePostsToFile(posts);
  res.json({ message: "Post deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
