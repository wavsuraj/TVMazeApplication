

//* validators/login.validator.js
const Joi = require('joi')
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// const showSchema = Joi.object({
//     id: Joi.number().required(),
//     name: Joi.string().required(),
//     cast: Joi.array().items({
//         id: Joi.string().required(),
//         name: Joi.number().required(),
//         birthday: Joi.string().required(),
//       })
// });

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
// export default Show;
module.exports = Show;
