const express = require('express')
const cookie_parser = require('cookie-parser')
const body_parser= require('body-parser')

const app = express();

app.get('', function (req, res) {
   res.send('');
})

var page = path.join(__dirname, 'public');
express.use(express.static(page))

const server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})