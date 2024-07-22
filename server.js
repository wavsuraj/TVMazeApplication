
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dbConfig = require('./config/database.config.js');
const rateLimitMiddleware = require('./config/rateLimiter.js');

const paginatedShowRoute = require('./routes/paginatedShow.js');
const showRoute = require('./routes/show.js');
const getCastDetailsByShowIdRoute = require('./routes/castDetailsByShowId.js');



mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.configure(function () {
//     app.set('db', { 'main': db, 'show': db.model('Show') })
// })

app.use('/getPaginatedShowDetails', rateLimitMiddleware, paginatedShowRoute);
app.use('/getAllShowDetails', rateLimitMiddleware, showRoute);
// app.use('/getCastDetailsByShowId', rateLimitMiddleware, getCastDetailsByShowIdRoute);


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

module.exports = app;