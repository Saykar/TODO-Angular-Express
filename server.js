// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    // connect to mongoDB database 
    mongoose.connect('mongodb://localhost/myapp');

    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));

    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model =================
    var Todo = mongoose.model('Todo', {
        text : String
    });

    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
          text : req.body.text,
          done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the remaining todos
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    var request = require('request');

    app.use('/api/v1', function(req, res) {
      // Hit flame
      console.log("API GET");
      console.log(req.originalUrl);

      var url = req.originalUrl.substring(4);
      var flame_url = "http://127.0.0.1:8001"+url;
      console.log(flame_url);

      req.pipe(request(flame_url))
      .on('response', function(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type'])
      })
      .pipe(res);
    });


    app.post('/api/v1', function(req, res) {
      // Hit flame
      console.log("API POST");
      console.log(req.originalUrl);

      var url = req.originalUrl.substring(4);
      var flame_url = "http://127.0.0.1:8001"+url;
      console.log(flame_url);

      req.pipe(request.post(flame_url))
      .on('response', function(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type'])
      })
      .pipe(res);
    });

    //front-end application
    app.get('*', function(req, res){
      // load the single view file (angular will handle the page changes on the front-end)
      res.sendfile('./public/index.html');
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
