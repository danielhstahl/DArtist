var express = require('express');
var app = express();
var port=8125;
app.use(express.static('node_modules'));
app.get('*', function(req, res){
  res.sendFile(__dirname +'/node_modules/index.html');
});
app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
