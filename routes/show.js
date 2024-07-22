
const express = require('express');
const router = express.Router();

const { getAllShowDetails } =
    require('../controllers/show');

/* Define the routes for the CRUD operations using router.route() */

router.route('/')
    .get(getAllShowDetails); // Read: Get all users

module.exports = router;