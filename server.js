var express = require('express');
var app = express();
var mongoose = require('mongoose'); // for working w/ our database
var vault = require("avault").createVault(__dirname);
var config = require("./app/models/credentials");//__dirname+"\\app\\models\\credentials");//"credit"
//var a = new config();// create an instance of the object so as to use it



//mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, function (err) {
    if (err) throw err;
});

var movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    release_year: {type: Number, required: true},
    actor: [{type: String}]
});

var Movie = mongoose.model('movie', movieSchema);


function funct(req){
    var method = req.method;
    console.log(method);
    //var object = Object.keys(req.res);
    var response = {
        'method' : method,
        'headers' : req.headers,
        'query' : req.query,
        'body' : req.body,
    };
    return response;
};






//get all movies
app.get('/movies', function(req, res,next) {

    Movie.find({}, function(err, movies){
        if (err) throw err;
        console.log(movies);
        res.json(movies);
    },res);








});
//error ---> no bulk loading available
app.put('/movies', function(req, res,next) {
    var method = req.method;
    console.log(method + " Failed with error 403. The server doesn't accept bulk updates.");

    res.status(403);        // HTTP status 403: forbidden
    res.send(req.method + " Method is not supported by server. The server doesn't accept bulk updates.");

    next();


});
//create a movie
app.post('/movies', function(req, res,next) {

    // first find out if the movie exists

    Movie.find({title : req.headers.title}, function(err, movies){//actor[0]: req.headers.actor1

        // console.log(movies);
        //console.log(req.headers.title)

        if (err) throw err;
        console.log(req.headers.actor1 == undefined);

        if (movies.length > 0 ){
            //res.status(409); //  '409': 'Conflict',
            var responceTo = {one :"THIS MOVIE EXISTS ALREADY IN THE DATABASE"};
            console.log("THIS MOVIE EXISTS ALREADY IN THE DATABASE");
            //responceTo.movies = movies;
            console.log(Object.keys(movies[0]._doc));

            var R = {
                _id:movies[0]._id,
                title:movies[0].title,
                release_year:movies[0].release_year,
                actor1: movies[0]._doc.actor[0],
                actor2: movies[0]._doc.actor[1],
                actor3: movies[0]._doc.actor[2]
            }

            R.error = responceTo;

            res.json(R);
        }


        m = new Movie
        m.title = req.headers.title;
        m.release_year = req.headers.year;
        m.actor[0] = req.headers.actor1;
        m.actor[1] = req.headers.actor2;
        m.actor[2] = req.headers.actor3;


        if (req.headers.title == "")
        {
            res.status(206);//'Partial Content',
            console.log("ERROR");
            var responceTo = {error :"PLEASE GIVE A TITLE FOR THE MOVIE"};
            responceTo.movies = m;
            res.json(responceTo);
        }
        else if (req.headers.year == "")
        {
            res.status(206);//'Partial Content',
            console.log("ERROR");
            var responceTo = {error :"PLEASE GIVE A YEAR FOR THE MOVIE"};
            responceTo.movies = m;
            res.json(responceTo);

        }
        else if (isNaN(req.headers.year)||req.headers.year<1000||req.headers.year>2050)
        {
            res.status(206);//'Partial Content',
            console.log("ERROR");
            var responceTo = {error :"THE YEAR MUST HAVE A NUMBERICAL 4 DIGIT VALUE"};
            responceTo.movies = m;
            res.json(responceTo);
        }
        else if (req.headers.actor1== ""||(req.headers.actor1 === undefined))
        {
            res.status(206);//'Partial Content',
            console.log("ERROR");
            var responceTo = {error :"actor1 MUST HAVE A VALUE"};
            responceTo.movies = m;
            res.json(responceTo);
        }
        else if (req.headers.actor2== ""||(req.headers.actor2 === undefined))
        {
            res.status(206);//'Partial Content',
            console.log("ERROR");
            var responceTo = {error :"actor2 MUST HAVE A VALUE"};
            responceTo.movies = m;
            res.json(responceTo);
        }
        else if (req.headers.actor3== ""||(req.headers.actor3 === undefined))
        {
            res.status(206);//'Partial Content',
            console.log("ERROR");
            var responceTo = {error :"actor3 MUST HAVE A VALUE"};
            responceTo.movies = m;
            res.json(responceTo);
        }
        else if(movies==0)    // if (req.headers.title == Movie)
        {
            //  res.status(200);//200
            console.log(req.headers.title + " is saved to the database");
            var responceTo = {message: req.headers.title + " is saved to the database"};
            responceTo.movies = m;
            responceTo._id = m._doc._id;

            res.json(responceTo);
            m.save();
        }



    },res, req,next);


});
// error -> not allowed to delete all movies
app.delete('/movies', function(req, res,next) {


    var method = req.method;
    console.log(req.method + " Failed with error 403.");

    res.status(403);        // HTTP status 403: forbidden
    res.send(req.method + " Method is not supported by server.");

    next();

});

//get an instance of the express router as a variable
var apiRouter = express.Router();

///////////////////////////////////////////////////figure out a variable in the URN



/////////////////////////////////////////////////////////////////////////////////////put in the BODY PARESER
/////////////////////////////////////////////////////////////////////////////////////put in the MONGOOSE
/////////////////////////////////////////////////////////////////////////////////////put in the MORGAN

//get a single movie 
apiRouter.get('/movie/:id', function(req, res,next) {
    var id = req.params.id;
    console.log(id);
    req.headers.id = id;
//res.json(funct(req));
//res.send(Object.keys(req));
//res.send(req.url);
//res.send(req.params.id)

    Movie.find({_id: req.params.id }, function(err, movies) {

      //  if (err) {res.json(Object.keys(err)); next();//throw err;;
        //};
        console.log("Fucking Shit:");

       console.log(movies[0] === undefined);

            if (movies[0] === undefined)
            {
                var Message = {message: "The id '" + req.params.id+"' doesn't have an applicable record. Please check the database and try again..."}

                res.json(Message);


            }

            else if (movies[0]._id == req.params.id)
            {
                console.log(movies);
                res.json(movies);
                //next();
            }
            else
            {

        var Message = {message: "The id '" + req.params.id+"' doesn't have an applicable record. Please check the database and try again..."}

        res.json(Message);
            }

    });
    /*
     Movie.find({_id: req.headers.id }, function(err, movies){
     if (err){ throw err;
     console.log(err);
     res.json(err);}
     console.log(movies);
     if(movies.length > 0)
     res.json(movies);

     else
     {
     var L = {message: "The id "+req.headers.id + " isn't in the database. Please try again..."};
     res.json(L);
     res.status(400)//'400': 'Bad Request',
     }

     */
    // error 404-----> <cannot get --> see postman et al>

});
apiRouter.put('/movie/:id', function(req, res,next) {
    var method = req.method;
    console.log(method + " Failed with error 403. The server doesn't accept bulk updates.");

    res.status(403);        // HTTP status 403: forbidden
    res.send(req.method + " Method is not supported by server. The server doesn't accept updates in any applicable form  ;(  .");

    next();

});
/*
 //update a movie
 apiRouter.put('/movie/:id', function(req, res,next) {
 var id = req.id;
 console.log(id);

 m.title = req.headers.title;
 m.release_year = req.headers.year;
 m.actor[0] = req.headers.actor1;
 m.actor[1] = req.headers.actor2;
 m.actor[2] = req.headers.actor3;
 Movie.find({}, function(err, movies) {
 if (err) throw err;
 var move;
 for (var i = 0; i < movies.length; i++){

 if (movies[i]._id == req.params.id)
 {

 if (req.headers.title !== "")
 {
 movies[i].title = req.headers.title;
 }

 if (!(isNaN(req.headers.year)))
 {
 if(req.headers.year<999&&req.headers.year>9999)
 {
 movies[i].year = req.headers.year;
 }
 else
 {
 res.send("The input for the year of the movie, being updated, isn't allowed. Please try again... ")
 }
 }
 console.log("HERE:" + req.headers.actor3);
 if (req.headers.actor1!== "")
 {
 movies[i].actor1 = req.headers.actor1;
 }
 if (req.headers.actor2!== "")
 {
 movies[i].actor2 = req.headers.actor2;
 }
 if (req.headers.actor3!== "")
 {
 movies[i].actor3 = req.headers.actor3;
 }
 movies[i].save();
 res.json(movies);
 /*
 console.log(movies[i].title );
 movies[i].actor[0] =  "FIXED";

 console.log(movies[i].title );
 movies[i].save();
 console.log(movies[i]);
 res.json(movies[i]);
 next();
 move = movies[i];
 }
 }
 if (move.length ==0)
 res.send("The id '" + req.params.id+"' doesn't have an applicable record. Please check the database and try again...");
 });
 });
 */
//error -> we want them to use the pust above in the simple route
apiRouter.post('/movie/:id', function(req, res,next) {
    var method = req.method;
    console.log(method + " Failed with error 403. The server doesn't accept posts here.");

    res.status(403);        // HTTP status 403: forbidden
    res.send(req.method + " Method is not supported by server. The server doesn't accept bulk updates.");

    next();

});
// deletes a movie
apiRouter.delete('/movie/:id', function(req, res,next) {
    var id = req.id;
    console.log(id);

    Movie.findOneAndRemove(  {_id: req.params.id } , function (err, movies) {




        if (err)  {throw err;}

        if (movies != null)
        {
            console.log("~~~~~~~~~~DELETING~~~~~~~~~~");
            console.log(movies);
            console.log("~~~~~~~~~~DELETING~~~~~~~~~~");

            movies.remove(function (err) {
                //console.log(Object.keys(err));
                movies.save(function (err) {
                });
                if (err) {console.log(err);               // we are throwing an error here when we actually delete something
                    throw err;
                }

                console.log("Movie successfully deleted");

                var message = {Message:"This movie has been successfully deleted:"};
                message.movie = movies;
                res.json(message);
            });
        }
        else
        {res.send("The movie id '"+ req.params.id+"' cannot be found. Please try again...")}


    });

});




// test route to make sure everything is working
// accessed at GET http://localhost:8080/movies/

app.use('/movies', apiRouter);



// catch all for bad requests against the url

// start the server
app.listen(1337);
console.log('1337 is the magic port!');
console.log("http://localhost:1337/");





/*


 app.use("/", function (req, res,next){

 var method = req.method;
 console.log(method + " Failed with error 405");

 res.status(405);        // HTTP status 405: method not allowed
 res.send('Method is not supported by server');

 next();
 });


 */