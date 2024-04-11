const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use(require('./routes/index'));

app.listen(3000);
console.log('Server on port 3000');
