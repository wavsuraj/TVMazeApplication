
const express = require('express');
const router = express.Router();

const { getPaginatedShowDetails } =
    require('../controllers/paginatedShow');

/* Define the routes for the CRUD operations using router.route() */

router.route('/')
    .get(getPaginatedShowDetails); // Read: Get all users

module.exports = router;