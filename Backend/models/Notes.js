const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    title : {
        type : String,
        require : true,
    },
    Description : {
        type : String,
        require : true,
        // unique : true
    },
    Tag : {
        type : String,
        default : "general",
    },
    date : {
        type : String,
        default : Date.now,
    },

})

module.exports = mongoose.model('Notes',NoteSchema);