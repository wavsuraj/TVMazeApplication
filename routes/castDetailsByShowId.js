
const express = require('express');
const router = express.Router();

const { castDetailsByShowId } =
    require('../controllers/castDetailsByShowId');

/* Define the routes for the CRUD operations using router.route() */

router.route('/')
    .post(castDetailsByShowId); // Read: Get all users

module.exports = router;
