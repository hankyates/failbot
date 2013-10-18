var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var api = require('./src/js/api');


// all environments
app.set('port', 8001);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'src')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function(req,res){
    res.render('index', { title: 'THIS IS FAILBOT!'});
});

app.get('/work', function(req,res){
    var response = api.performNextAction();
    res.render('index', { title: 'Did some work!', message: response});
});

app.get('/commands', function(req,res){
    var commands = api.getCommands();
    res.render('queue', { title: 'Command List', commands: commands });
});

app.post('/add', function(req,res){
    var command = req.body.command;
    api.addCommand(command);
    res.render('index', {message: 'Added ' + command + ' to the queue.'});
});

app.get('/add/:command', function(req,res){
    var command = req.params.command;
    if (command){
        api.addCommand(command);
        res.render('index', {message: 'Added ' + command + ' to the queue.'});
    } else {
        res.status(400);
        res.send('No command found');
    }
})

app.get('/move/forward/:count',function(req,res){
    var count = req.params.count;
    res.send('moving forward ')
});


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
