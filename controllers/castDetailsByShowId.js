// import axios from 'axios';
const axios = require('axios');
const async = require('async');
const lodash = require('lodash');
const rateLimitMiddleware = require('../config/rateLimiter');

const distantFutureDate = new Date(8640000000000000);
// const firstSort = 'due_date';

const castDetailsByShowId = async (showID) => {

    // console.log("Data : castDetailsByShowId", showID,);
    let ID = showID;
    let data = await axios.get(`https://api.tvmaze.com/shows/${ID}/cast`);

    if (data.err) {
        // res.send({
        //     "status": "400",
        //     "data": data.err,
        //     "message": "failure"
        // })
        return data.err;
        console.log('error');
    }
    else {
        // console.log("HERE I A M 2",);

        let castDataByShowId = {};
        let castByShowIdArray = [];
        // let sortDatabyBirthday = lodash.sortBy(data.data, (obj) => Date.parse(obj.person.birthday), ['desc']);
        // let sortDatabyBirthday = data.data.sort((a, b) => {
        //     let dateA = a.person.birthday ? new Date(a.person.birthday) : distantFutureDate
        //     let dateB = b.person.birthday ? new Date(b.person.birthday) : distantFutureDate
        //     return dateA.getTime() - dateB.getTime();
        // })
        let apiDataByShowId = data && data.data ? lodash.map(data.data, (obj) => {
            let tempobj = {};
            // obj.showId = value; 
            tempobj.id = obj.person.id;
            tempobj.name = obj.person.name;
            tempobj.birthday = obj.person.birthday;
            // console.log("tempobj", tempobj);
            return tempobj;
        }) : [];

        // const sortDescFieldName = '';
        // let sortCastDataByBirthday = lodash.orderBy(apiDataByShowId, [(o) => o & o.birthday ? Date.parse(o.birthday) : 0], ['desc']);
        let sortCastDataByBirthday = apiDataByShowId.sort(({ ["birthday"]: a }, { ["birthday"]: b }) => (
            (a == null) - (b == null) // move null values to the back of the array
            || -(a > b)               // move `a` to the back if it's smaller than `b`
            || +(a < b)               // move `a` to the front if it's greater than `b`
        ));
        console.log("sortCastDataByBirthday", JSON.stringify(sortCastDataByBirthday[0]));

        // apiDataByShowId = apiDataByShowId.sort((a, b) => {
        //     let dateA = a.birthday ? new Date(a.birthday) : distantFutureDate
        //     let dateB = b.birthday ? new Date(b.birthday) : distantFutureDate
        //     return dateA.getTime() - dateB.getTime();
        // });

        // apiDataByShowId = lodash.orderBy(apiDataByShowId, [(o) => { return o.birthday ? new Date(o.birthday) : new Date(null) }], ['desc']);

        castDataByShowId.showId = ID;
        castDataByShowId.cast = sortCastDataByBirthday;

        return castDataByShowId;
        // res.send({
        //     "status": "200",
        //     "data": castDataByShowId,
        //     "message": "success"
        // })

        // console.log('fetched response');
    }


    // console.log("Hello");
    // res.json({ message: "Cast Detail Route" }); // dummy function for now
};

module.exports = { castDetailsByShowId };