require('dotenv').config();
const path = require('path');
const express = require('express');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials'); // add Access-Control-Allow-Credentials header to response, to allow frontend to access server
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')

const app = express();
const PORT = process.env.PORT || 3500;

const connectDB = require('./config/dbConn');
connectDB();

// custome middleware logger
app.use(logger)
app.use(credentials);
app.use(cors(corsOptions))

// middleware for form data
app.use(express.urlencoded({extended: false}));
// middleware for json
app.use(express.json())
// middleware for cookie
app.use(cookieParser())

// serve static file
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

// these routes don't need verify user
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use("/auth", require("./routes/auth"));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// verify for these routes only
app.use(verifyJWT); // this will add "req.roles" and "req.user"
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({error: '404 Not Found'});
  } else {
    res.type('txt').send("404 Not Found");
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () =>{
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
})
