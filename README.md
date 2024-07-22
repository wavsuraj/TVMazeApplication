TVMaze Application is a service used to provide a paginated list of all tv shows containing the id of the TV show and 
a list of all the cast that are playing in that TV show with the help of data which is fetched from TVMaze database with url : https://www.tvmaze.com/.

Steps to run project 

## Requirements
For development, you will only need Node.js and a node global package, Yarn, installed in your environement.
You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).
If the installation was successful, you should be able to run the following command.
    $ node --version
    v8.11.3
    $ npm --version
    6.1.0
If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.
    $ npm install npm -g

$ git clone https://github.com/wavsuraj/TVMazeApplication.git

$ cd "TVMazeApplication-master"

$ npm install

$ npm run start 

There are two routes : 

1. getAllShowDetails :- It is used to fetch all data from TVMaze database using api endpoint : https://api.tvmaze.com/show and a helper function getCastDetailsByShowId present in ./controllers/castDetailsByShowId.js to fetch cast details of each TV show  and add/update records in shows collection of MongoDb

2. getPaginatedShowDetails : This is the api which gives paginated response of all the show detais along with corresponding cast details .

    
