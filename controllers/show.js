// import axios from 'axios';
const axios = require('axios');
const async = require('async');
const lodash = require('lodash');
const castDetailsAPI = require('./castDetailsByShowId').castDetailsByShowId;
// const rateLimitMiddleware =  require('../config/rateLimiter');
// const request = require('request')
const rateLimitMiddleware = require('../config/rateLimiter');
const ShowModel = require('../model/show');
const distantFutureDate = new Date(8640000000000000);


const getShowAndCastDetails = async (req, res) => {
    try {
        let results = await async.auto({
            getDataFromTVMazeAPI: async () => {
                // async code to get some data
                let data = await axios.get('https://api.tvmaze.com/show');
                // console.log("Data :", JSON.stringify(data.data));
                if (data.err) {
                    // return data.err;
                    res.send({
                        "status": "400",
                        "data": data.err,
                        "message": "failure"
                    })
                }
                return data.data;
            },
            transformData: ['getDataFromTVMazeAPI', async (results) => {
                // once there is some data and the directory exists,
                // write the data to a file in the directory

                let objData = lodash.map(results.getDataFromTVMazeAPI, 'id');
                let castData = [];
                // console.log("objData.length", JSON.stringify(objData), objData.length);
                for (let element of objData) {
                    // console.log("element", element)
                    let apiData = await castDetailsAPI(element);
                    castData.push(apiData);
                }
                // console.log("castData.length", castData.length);
                // castData = lodash.orderBy(castData, [(o) => o.birthday ? Date.parse(o.birthday) : Date.parse(distantFutureDate)], ['desc']);

                let outputResult = lodash.map(results.getDataFromTVMazeAPI, (a) => {
                    // var findObj = lodash.find (castData,a);
                    let findObj = lodash.find(castData, (b) => {
                        if (a.id === b.showId) {
                            return b;
                        }
                    });
                    if (findObj) {
                        // console.log("Inside findobj: ", a.id, a.name, findObj)
                        let tempobj = {};
                        tempobj["id"] = a.id;
                        tempobj["name"] = a.name;
                        tempobj["cast"] = findObj.cast;
                        return tempobj;
                    }
                });

                let bulkWriteDocs = outputResult.map(doc => ({
                    updateOne: {
                        filter: { id: doc.id },
                        update: doc,
                        upsert: true,
                    }
                }));
                // console.log("OutputResult", JSON.stringify(bulkWriteDocs))
                let showDocs = await ShowModel.bulkWrite(bulkWriteDocs)
                    .then((bulkWriteOpResult) => {
                        console.log('BULK update OK:', bulkWriteOpResult);
                        return bulkWriteOpResult;
                    })
                    .catch(error => console.log(console, 'BULK update error:', error));
                res.send({
                    "status": "200",
                    "data": showDocs,
                    "message": "success"
                });
                // return showDocs;



                // ShowModel.insertMany(outputResult)
                //     .then((obj) => {
                //         console.log("ShowModel Details Added!", obj);
                //         return obj;
                //         // res.status(200).json("ShowModel Details Added!");
                //     })
                //     .catch(err => {
                //         console.log("Error", err)
                //         return err;
                //         // return res.send({
                //         //     "status": "400",
                //         //     "data": err,
                //         //     "message": "failure"
                //         // })
                //     });



                // ShowModel.save()
                //     .then(() => console.log('ShowModel Details created'))
                //     .catch((err) => console.log(err));
                // let callCastById = lodash.forEach(objData, async (value) => {
                //     // console.log(value);
                // let data = await castDetailsAPI(1);
                // const castApiData = await castDetailsAPI(1);
                // console.log('data', castApiData)

                // let data = await axios.get(`https://api.tvmaze.com/shows/${1}/cast`);
                // // console.log("Data :", JSON.stringify(data.data));

                // if (data.err) {
                //     res.send({
                //         "status": "400",
                //         "data": "",
                //         "message": "failure"
                //     })
                //     console.log('error');
                // }
                // else {
                //     console.log("HERE I A M 2",);
                //     // res.send({
                //     //     "status": "200",
                //     //     "data": data.data,
                //     //     "message": "success"
                //     // });

                //     let castDataByShowId = {};
                //     let castByShowIdArray = [];
                //     let apiDataByShowId = lodash.map(data.data, (obj) => {
                //         let tempobj = {};
                //         // obj.showId = value; 
                //         tempobj.id = obj.person.id;
                //         tempobj.name = obj.person.name;
                //         tempobj.birthday = obj.person.birthday;
                //         console.log("tempobj", tempobj);
                //         return tempobj;
                //     });
                //     castDataByShowId.showId = 1;
                //     castDataByShowId.cast = apiDataByShowId;

                //     // return apiDataByShowID;
                //     res.send({
                //         "status": "200",
                //         "data": castDataByShowId,
                //         "message": "success"
                //     })

                //     console.log('fetched response');
                // }

                // });
                // console.log("Here I am ", castData)
                // console.log("Here I am ", results.getDataFromTVMazeAPI)
                // return (outputResult);
                // callback(null, castApiData);
            }],
        });
        // console.log('results = ', results);
        // console.log('results = ', results);
        // results = {
        //     getDataFromTVMazeAPI: results,
        //     transformData: results,
        // }
        // res.send({
        //     status: "200",
        //     data: results.transformData,
        //     message: "success"
        // })
    }
    catch (err) {
        // return err;
        res.send({
            status: "400",
            data: err,
            message: "failure"
        })
        console.log(err);
    }
}

const getPaginatedShowDetails = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 12;
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
        result.data = await ShowModel.find()
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

module.exports = { getShowAndCastDetails, getPaginatedShowDetails };