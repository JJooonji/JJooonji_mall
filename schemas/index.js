const mongoose = require("mongoose");

//mondoDB에 연결
const connect = () => {
    mongoose.connect("mongodb://localhost:27017/JJooonji_mall",{ignoreUndefined:true}).catch((err) => {
        console.error(err);
    })
};

module.exports = connect;