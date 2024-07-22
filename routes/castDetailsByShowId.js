
const express = require('express');
const router = express.Router();

const { getCastDetailsByShowId } =
    require('../controllers/castDetailsByShowId');

/* Define the routes for the CRUD operations using router.route() */

router.route('/')
    .get(getCastDetailsByShowId); // Read: Get all users

module.exports = router;
