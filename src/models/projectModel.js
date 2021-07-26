const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  userId: {
    type: String,
    required: true,
    immutable: true,
  },
  title: {
    type: String,
  },
  position: {
    type: String,
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
