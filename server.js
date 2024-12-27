require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const {logger} = require('./middleware/logEvents.js');
const errorHandler = require('./middleware/errorHandler.js');
const corsOptions = require('./config/corsOptions.js');
const verifyJWT = require('./middleware/verifyJWT.js');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn.js');
const PORT = process.env.PORT || 4000;

// Connect to mongoDB
connectDB();

//custom middleware
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));


//built-in middleware, applies to all the routes below it (switch-case-default style)
app.use('/',express.urlencoded({extended: false}));
app.use('/',express.json());


app.use('/',express.static(path.join(__dirname,'public')));
app.use('/subdir',express.static(path.join(__dirname,'public'))); //enable express to use public folder for subdir




app.use('/',require('./routes/root.js'));
app.use('/subdir',require('./routes/subdir.js')); //MW function for routes
app.use('/register',require('./routes/api/register.js'));


//middleware for cookies
app.use(cookieParser());
app.use('/auth',require('./routes/api/auth.js'));
app.use('/refresh',require('./routes/api/refresh.js'));
app.use('/logout',require('./routes/api/logout.js'));
app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees.js'));



// app.get('/*', (req,res)=>{
//     res.status(404).sendFile(path.join(__dirname,'views','404.html'));
// });

app.all('*', (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);


mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
