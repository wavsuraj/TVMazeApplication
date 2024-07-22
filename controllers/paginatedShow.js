// import axios from 'axios';
const ShowModel = require('../model/show');

const getPaginatedShowDetails = async (req, res) => {
    try {

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const result = {};
        const totalPosts = await ShowModel.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await ShowModel.countDocuments().exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }
        result.data = await ShowModel.find({},
            { _id: 0, __v: 0 }
        )
            .select('id name cast')
            .sort("id")
            .skip(startIndex)
            .limit(limit)
            .exec();
        result.rowsPerPage = limit;
        return res.json({ msg: "Show Data Fetched successfully", data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

module.exports = { getPaginatedShowDetails };