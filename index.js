const express = require('express');
const routes = require('./routes/index.js');
const { config } = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')

config()

const port = process.env.PORT_ADDR;
const mongoAddr = process.env.MONGO_ADDR;

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: error.message || 'Request execution error.',
    });
});

app.listen(port, async () => {
    console.log(`Server started at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop');
    await mongoose.connect(mongoAddr);
    console.log('MongoDB connected');
});
