var mongoose = require('mongoose'),
    settings = require('../settings'),
    ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(settings.url);

mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}));

mongoose.model('Blog', new mongoose.Schema({
    user: 　{
        type: String,
        required: true
    },
    userFace: {
        type: String,
        required: true
    },
    releaseTime: {
        type: Number,
        default: Date.now() + 8 * 60 * 60 * 1000
    },
    text: {
        type: String,
        required: true
    },
    img: {
        type: Array
    },
    isForward: {
        type: Boolean,
        required: true
    },
    forwardFrom: {
        type: Number
    },
    commentCount: {
        type: Number
    },
    forwardCount: {
        type: Number
    },
    praiseCount: {
        type: Number
    }
}));

mongoose.model('Comment', new mongoose.Schema({
    blog: {
        type : ObjectId,
        ref : 'Blog',
        required : true
    },
    user : {
        type : String,
        required : true
    },
    userFace : {
        type : String,

    },
    text : {
        type : String,
        required : true
    },
    releaseTime : {
        type : Number,
        default : Number(Date.now() + 8 * 60 * 60 * 1000)
    },
    praiseCount : {
        type : Number
    }
}));


global.Model = function(modelName) {
    return mongoose.model(modelName);
};
