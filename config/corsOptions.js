const allowedOrigins = require('./allowedOrigins.js');


const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.includes(origin) || !origin){ // !origin for undefined
            callback(null,true);
        }else{
            callback(new Error('Not allowed by cors'));
        }
    },
    optionsSuccessStatus: 200
};




module.exports = corsOptions;