var messages = require('../models/message');
var moment = require('moment');
var db = require('../models/db');
class SocketHander {
    constructor() {
        this.db
    }

    connect() {
        this.db = require('mongoose').connect(db.db);
        this.db.Promise = global.Promise;
    }
    getMessage() {
        return messages.find();
    }
    storeMessage(data,cb) {
        console.log(data);
        var newMessage = new messages({
            name: data.name,
            msg: data.msg,
            time: moment().valueOf(),
        });
        // console.log(newMessage.time)
        cb(newMessage.time);
        var doc=newMessage.save();
        
    }
}

module.exports=SocketHander;