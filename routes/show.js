
const express = require('express');
const router = express.Router();

const { getShowAndCastDetails, getPaginatedShowDetails } =
    require('../controllers/show');

/* Define the routes for the CRUD operations using router.route() */
// const showAndCastDetailsRoute = 
router.route('/')
    .get(getShowAndCastDetails); // Read: Get all users

router.route('/')
    .get(getPaginatedShowDetails); // Read: Get all users

module.exports = router;