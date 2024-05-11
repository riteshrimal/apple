const mongoose = require("mongoose");




const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referring to the 'User' model
    },
    image: {
        type: String,
    },
    imageText: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Array,
        default: [],
    },
});
mongoose.model('Post', postSchema);
// Register the schema with Mongoose and export the model
module.exports = mongoose.model("Post", postSchema);
