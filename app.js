//dependencies
var express = require("express");
var app = express();
var fs = require("fs");
var ejs = require("ejs");
var request = require("request");
// var $interests = $(".photo");

//sql
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('forum.db');

//middleware
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static('public'));


//config
app.listen(2001, function() {
  	console.log("I'm listening on port 2001!");
});


//FORUMS PAGE(INDEX)
app.get("/", function(req, res){
	// console.log("index page fired");
	var template = fs.readFileSync("./views/index.html", "utf8");
	res.send(template);
});


//FORUMS PAGE(INDEX)
app.get("/forums", function(req, res){
	// console.log("forums page fired");
	var template = fs.readFileSync("./views/index.html", "utf8");
	db.all("SELECT * FROM interests", function(err, rows){
		if(err){
			console.log(err);
		}else{
		  	var rendered = ejs.render(template, {stuff: rows})
		  	res.send(rendered);
		}
	});
	// $interests.on("click", function(event){
	// console.log("square clicked");
// });
});


//THREADS PAGE
app.get("/forums/:id/threads", function(req, res){
	var id = req.params.id;
	// console.log("threads page fired");
  	var template = fs.readFileSync("./views/threads.html", "utf8");
  	db.all("SELECT * FROM threads WHERE interests_id =? ORDER BY votes DESC", id, function(err, rows){
  		if (err){
  			console.log(err);
  		}else{
  			console.log(rows);
  		}
	  	var myObject = [{id: id}];
		var rendered = ejs.render(template, {stuff: rows, id: myObject});
		res.send(rendered);
  	});
});


//NEW THREAD PAGE
app.get("/forums/:id/threads/new", function(req, res){
	// console.log("new thread page fired");
	var forumId = [{id: req.params.id}];
  	var template = fs.readFileSync("./views/new.html", "utf8");
  	var rendered = ejs.render(template, {id: forumId});
  	res.send(rendered);
});


//REPLY PAGE
app.get("/forums/:id/threads/:id/edit", function(req, res){
	// console.log("reply thread page fired");
  	var template = fs.readFileSync("./views/edit.html", "utf8");
  	res.send(template);
});


//SEE ONE THREAD PAGE this is  ashow
app.get("/forums/:forums_id/threads/:threads_id", function(req, res){
	// console.log("view thread page fired");
	var forumId = req.params.forums_id;
	var threadId = req.params.threads_id;
	var myReplies;
	db.all("SELECT * FROM threads WHERE threads.id=?", threadId, function(err, row){
		if (err){
			console.log(err);
		}else{
			// console.log(row);
			db.all("SELECT * FROM replies WHERE threads_id=?", threadId, function(err, rows){
				if (err){
					console.log(err);
				}else{
					// console.log("spitting out all replies for selected thread");
					// console.log(rows);
					myReplies = rows;
				}
			var myObject = [{id: forumId}];
		  	var template = fs.readFileSync("./views/show.html", "utf8");
		  	var rendered = ejs.render(template, {stuff: row, id: myObject, replies: myReplies})
		  	res.send(rendered);
			});
		}
	});
});


//ADD A REPLY/COMMENT PAGE LOGIC
app.post("/forums/:forum_id/threads/:threads_id/replies", function(req, res){
	// console.log("reply thread page logic fired");
	var oldVotes = parseInt(req.body.currentVotes);
	if (req.body.vote == 1){
		db.run("UPDATE threads SET votes=? WHERE id=?",
			oldVotes + 1, req.params.threads_id,
			function(err){
				if(err){
					console.log(err);
				}else{
				}
		});
	}
	db.run("INSERT INTO replies (content, threads_id, username) VALUES (?,?,?)",
		req.body.reply, req.params.threads_id, req.body.username,
		function(err){
			if(err){
				console.log(err);
			}else{
				console.log("new info inserted into replies");
			}
	});
	res.redirect("/forums/" + req.params.forum_id + "/threads/" + req.params.threads_id)
});


//NEW THREADS PAGE LOGIC
app.post("/forums/:id/threads", function(req, res){
	// console.log("new thread logic fired");
	// console.log(req.params.id);
	db.run("INSERT INTO threads (title, votes, interests_id) VALUES (?,?,?)",
		req.body.newThread, 0, req.params.id,
		function(err){
			if (err){
				console.log(err);
			}else{
				console.log("new thread inserted");
			}
	});
	res.redirect("/forums/" + req.params.id + "/threads")
});

//DONE!









