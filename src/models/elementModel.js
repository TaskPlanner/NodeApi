const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  id: {
    type: String,
  },
  text: {
    type: String,
  },
  state: {
    type: String,
  },
});

const ElementSchema = new Schema({
  userId: {
    type: String,
    required: true,
    immutable: true,
  },
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  iterate: {
    type: String,
  },
  project: {
    type: String,
  },
  priority: {
    type: String,
  },
  state: {
    type: String,
  },
  position: {
    type: String,
  },
  comments: {
    type: [CommentSchema],
  },
  inbox: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Element", ElementSchema);