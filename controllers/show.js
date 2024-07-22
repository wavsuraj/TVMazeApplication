// import axios from 'axios';
const axios = require('axios');
const async = require('async');
const lodash = require('lodash');
const castDetailsAPI = require('./castDetailsByShowId').getCastDetailsByShowId;
const ShowModel = require('../model/show');


const getAllShowDetails = async (req, res) => {
    try {
        let results = await async.auto({
            getDataFromTVMazeAPI: async () => {

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

                let objData = lodash.map(results.getDataFromTVMazeAPI, 'id');
                let castData = [];
                // console.log("objData.length", JSON.stringify(objData), objData.length);
                for (let element of objData) {
                    // console.log("element", element)
                    let apiData = await castDetailsAPI(element);
                    // console.log("API DATA", apiData);
                    castData.push(apiData);
                }
                // console.log("castData.length", castData.length);
                // castData = lodash.orderBy(castData, [(o) => o.birthday ? Date.parse(o.birthday) : Date.parse(distantFutureDate)], ['desc']);

                let outputResult = lodash.map(results.getDataFromTVMazeAPI, (a) => {

                    let findObj = lodash.find(castData, (b) => {
                        if (a.id === b.showId) {
                            return b;
                        }
                    });
                    if (findObj) {

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

                //Bulk Write Data to show collection
                let showDocs = await ShowModel.bulkWrite(bulkWriteDocs).then((bulkWriteOpResult) => {
                    // console.log('BULK update OK:', bulkWriteOpResult);
                    return bulkWriteOpResult;
                }).catch(error => {
                    // console.log(console, 'BULK update error:', error);
                    return error;

                });

                return showDocs;

            }],
        }, function (err, results) {
            if (err) {
                // console.log('err = ', err);
                res.send({
                    "status": "200",
                    "data": err,
                    "message": "success"
                });

            } else {
                // console.log('results = ', results);
                res.send({
                    "status": "200",
                    "data": results.transformData,
                    "message": "success"
                });
            }
        });

    }
    catch (err) {
        // return err;
        // console.log(err);
        res.send({
            status: "400",
            data: err,
            message: "failure"
        })
    }
}


module.exports = { getAllShowDetails };