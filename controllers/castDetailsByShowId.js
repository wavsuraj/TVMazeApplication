// import axios from 'axios';
const axios = require('axios');
const lodash = require('lodash');

const getCastDetailsByShowId = async (showID) => {

    // console.log("Data : getCastDetailsByShowId", showID,);
    let ID = showID;
    let data = await axios.get(`https://api.tvmaze.com/shows/${ID}/cast`);

    if (data.err) {
        // res.send({
        //     "status": "400",
        //     "data": data.err,
        //     "message": "failure"
        // })
        // console.log('error');
        return data.err;
    }
    else {
        // console.log("HERE I A M 2",);

        let castDataByShowId = {};

        let apiDataByShowId = data && data.data ? lodash.map(data.data, (obj) => {
            let tempobj = {};
            // obj.showId = value; 
            tempobj.id = obj.person.id;
            tempobj.name = obj.person.name;
            tempobj.birthday = obj.person.birthday;
            // console.log("tempobj", tempobj);
            return tempobj;
        }) : [];

        // ES6 Destructuring to sort Cast array with birthday values in descending order with null values at last  
        let sortCastDataByBirthday = apiDataByShowId.sort(({ ["birthday"]: a }, { ["birthday"]: b }) => (
            (a == null) - (b == null) // move null values to the back of the array
            || -(a > b)               // move `a` to the back if it's smaller than `b`
            || +(a < b)               // move `a` to the front if it's greater than `b`
        ));

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

module.exports = { getCastDetailsByShowId };