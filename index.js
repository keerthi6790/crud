const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Post = require("./models/post");

const app = express();
mongoose.connect(
  "mongodb+srv://m001-student:Ss8FlIZ96IGC3MJI@sandbox.seq12.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  () => {
    console.log("Connect With Db");
  }
);
var db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/InsertPosts", async (req, res) => {
  let title = req.body.title;
  let author = req.body.author;
  let content = req.body.content;
  var post = new Post();
  post.title = title;
  post.author = author;
  post.content = content;
  // Save the post
  post.save(function (error, savedPost) {
    if (error) {
      // send error response
      res.status(500).send({ error: "Unable to save Post " });
    } else {
      // send success response
      res.status(200).send(savedPost);
    }
  });
});
app.get("/", (req, res) => {
  Post.find({}, (err, doc) => {
    if (err) {
      res.status(500).send({ error: "unable to fetch" });
    }
    res.status(200).send(doc);
  });
});

app.post("/DeletePosts", async (req, res) => {
  let title = req.body.title;
  Post.deleteOne({ title: title })
    .then(() => {
      res.status(200).send("Deleted");
    })
    .catch((err) => {
      res.status(500).send({ error: "Unable to Delete post" });
    });
});
app.post("/findPosts", async (req, res) => {
  var query = req.body.title;
  Post.find({ title: query }, (err, doc) => {
    if (err) {
      res.status(500).send("Unable to fetch post");
    }
    res.send(doc);
  });
});

app.post("/UpdatePosts", async (req, res) => {
  var title = await req.body.title;
  var content = await req.body.content;
  Post.findOneAndUpdate(
    { title: title },
    { content: content },
    { new: true },
    (err, doc) => {
      if (err) {
        res.status(500).send("Unable to update");
      } else {
        res.status(200).send(doc);
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Running in the port!!!");
});
