
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');

const dbConfig = require('./config/database.config.js');
const rateLimitMiddleware = require('./config/rateLimiter.js');

const paginatedShowRoute = require('./routes/paginatedShow.js');
const showRoute = require('./routes/show.js');
const castDetailsByShowIdRoute = require('./routes/castDetailsByShowId.js');
// const callJobGetShowAndCastDetails = require('./controllers/show.js').getShowAndCastDetails;

// const app = express();



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
app.use('/showAndCastDetails', rateLimitMiddleware, showRoute);
app.use('/castDetailsByShowId', rateLimitMiddleware, castDetailsByShowIdRoute);


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});


// cron.schedule('15 * * * * *', () => {
//     console.log("Cron Started ")
//     callJobGetShowAndCastDetails();
//     console.log("Cron Ended ")
// })

module.exports = app;