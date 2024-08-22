const path = require('path');
const express = require('express');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')

const app = express();
const PORT = process.env.PORT || 3500;

// custome middleware logger
app.use(logger)
app.use(cors(corsOptions))

// middleware for form data
app.use(express.urlencoded({extended: false}));
// middleware for json
app.use(express.json())

// serve static file
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));
app.use('/register', require('./routes/register'));
app.use("/auth", require("./routes/auth"));

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

app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));