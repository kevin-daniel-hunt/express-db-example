const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;
const routes = require('./routes');


app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use(express.static('public'));

app.use(routes);


app.listen(port, () => console.log(`User group app listening on port ${port}!`));