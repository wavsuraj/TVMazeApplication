
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const showSchema = new Schema({
    id: { type: Number, unique: true },
    name: String,
    cast: [{
        id: Number,
        name: String,
        birthday: String
    }]
});

const Show = model('Show', showSchema);

module.exports = Show;
