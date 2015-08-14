//dependencies
var express = require("express");
var app = express();
var fs = require("fs");
var ejs = require("ejs");
var request = require("request");

//sql
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('forum.db');

//middleware
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

//config
app.listen(2001, function() {
  	console.log("I'm listening on port 2001!");
});

db.run("DROP TABLE IF EXISTS interests;", function(err) {
  if (err) {
    console.log(err);
  } else {
  // Create table interests
  db.run("CREATE TABLE interests (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, class TEXT, photo TEXT);");
  // console.log("interests table created!")
  }
});

db.run("DROP TABLE IF EXISTS threads;", function(err) {
  if (err) {
    console.log(err);
  } else {
  // Create table threads
  db.run("CREATE TABLE threads (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, votes INTEGER, user_id INTEGER, interests_id INTEGER);");
  // console.log("threads table created!")
  }
});

db.run("DROP TABLE IF EXISTS replies;", function(err) {
  if (err) {
    console.log(err);
  } else {
  // Create table replies
  db.run("CREATE TABLE replies (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, threads_id INTEGER, user_id INTEGER);");
  // console.log("replies table created!")
  }
});


//FORUMS PAGE(INDEX)
//index.html
app.get("/", function(req, res){
	// console.log("index page fired");
	var template = fs.readFileSync("./views/index.html", "utf8");
	res.send(template);
});


//FORUMS PAGE(INDEX)
//index.html
app.get("/forums", function(req, res){
	// console.log("forums page fired");
	//sql insert interests for homepage
	db.run("INSERT INTO interests (title, class, photo) VALUES (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?), (?,?,?)", 
		'one pot meals', 'pure-u-1-5', 'http://www.bonappetit.com/wp-content/uploads/2013/09/red-wine-braised-short-ribs-840x536.jpg',
		'the closet', 'pure-u-2-5', 'http://cds.a9t2h4q7.hwcdn.net/main/store/20090519001/items/media/Hardware/Whalenstoragelogo/ProductLarge/Closet_Organizer-Lifestyle-White.jpg',
		'small kitchens', 'pure-u-1-5', 'http://www.digsdigs.com/photos/creative-small-kitchen-ideas-16.jpg',
		'storage ideas', 'pure-u-1-5', 'http://agisaccessories.com/wp-content/uploads/2015/07/free-apartment-storage-ideas-wallpaper-hd-.jpg',
		'entertaining', 'pure-u-2-5', 'https://camdenblogs.files.wordpress.com/2015/08/small-space.jpg',
		'indoor plants', 'pure-u-1-5', 'http://local.dexknows.com/wp-content/uploads/2012/07/indoor-herb-garden.jpg',
		'when to clean', 'pure-u-2-5', 'http://p-fst2.pixstatic.com/52f2a9e2dbfa3f34b1000989._w.540_s.fit_.JPEG',
		'buying food', 'pure-u-1-5', 'http://media1.popsugar-assets.com/files/2013/04/28/059/n/28443503/e818849ca8b54483_shutterstock_130838090.xxxlarge/i/Make-Over-Your-Fridge.jpg',
		'how to hang art', 'pure-u-1-5', 'http://p-fst2.pixstatic.com/5313c338dbfa3f6bde0000e3._w.540_s.fit_.JPEG',
		'sharing the space', 'pure-u-2-5', 'http://a.dilcdn.com/bl/wp-content/uploads/sites/8/2013/08/iStock_000019993186XSmall.jpg',
		'your best friend', 'pure-u-1-5', 'http://www.petsgallery.xyz/wp-content/uploads/2015/07/pics-of-french-bulldog-puppies-taf8d5rvi.jpg',
		function(err){
			if (err){
				console.log(err);
			}else{
				// console.log("taking interests inputs");
			}
		});
	var template = fs.readFileSync("./views/index.html", "utf8");
	db.all("SELECT * FROM interests", function(err, rows){
		if(err){
			console.log(err);
		}else{
			// console.log(rows);
			// console.log("index page working");
		  	var rendered = ejs.render(template, {stuff: rows})
		  	res.send(rendered);
		}
	});
});


//THREADS PAGE
//threads.html
app.get("/forums/:id/threads", function(req, res){
	var id = req.params.id;
	db.run("INSERT INTO threads (title, votes, interests_id) VALUES (?,?,?), (?,?,?)",
		'small kitchens can be so cute', 0, + id,
		'bright colors', 1, + id,
		function(err){
			if(err){
				console.log(err);
			}else{
				// console.log("taking threads inputs");
			}
		});
	// console.log(id);
	// console.log("threads page fired");
  	var template = fs.readFileSync("./views/threads.html", "utf8");
  	db.all("SELECT * FROM threads WHERE interests_id =? ORDER BY votes DESC", id, function(err, rows){
  		if (err){
  			console.log(err);
  		}else{
  			// console.log("threads page working");
  			console.log(rows);
  		}
  	var myObject = [
  		{id: id}
  	];
	var rendered = ejs.render(template, {stuff: rows, id: myObject});
	res.send(rendered);
  	});
});


//NEW THREAD PAGE
//new.html
app.get("/forums/:id/threads/new", function(req, res){
	console.log("new thread page fired");
	var forumId = [
	{id: req.params.id}
  	];
  	var template = fs.readFileSync("./views/new.html", "utf8");
  	var rendered = ejs.render(template, {id: forumId});
  	res.send(rendered);
});


//REPLY PAGE
//edit.html
app.get("/forums/:id/threads/:id/edit", function(req, res){
	// console.log("reply thread page fired");
  	var template = fs.readFileSync("./views/edit.html", "utf8");
  	res.send(template);
});


//SEE ONE THREAD PAGE
//show.html
app.get("/forums/:forums_id/threads/:threads_id", function(req, res){
	console.log("view thread page fired");
	var forumId = req.params.forums_id;
	var threadId = req.params.threads_id;
	// console.log(forumId, threadId);
	db.run("INSERT INTO replies (content, threads_id) VALUES (?,?), (?,?)",
	'i also think kitchens are adorable', + threadId,
	'i did created some really neat storage ideas in my kitchen', + threadId,
	function(err){
		if(err){
			console.log(err);
		}else{
			// console.log("taking threads inputs");
		}
	});
	db.all("SELECT * FROM threads WHERE threads.id=?", threadId, function(err, row){
		if (err){
			console.log(err);
		}else{
			// console.log("spitting out the selected thread title and votes");
			// console.log(row);
			db.all("SELECT * FROM replies WHERE threads_id=?", threadId, function(err, rows){
				if (err){
					console.log(err);
				}else{
					console.log("spitting out all replies for selected thread");
					console.log(rows.content);
					myReplies.push(rows)
				}
			});
		}
	// console.log(myReplies);
	var myObject = [
		{id: forumId}
		];
	var myReplies = [];
  	var template = fs.readFileSync("./views/show.html", "utf8");
  	var rendered = ejs.render(template, {stuff: row, id: myObject, replies: myReplies})
  	res.send(rendered);
	});
});


//ADD A REPLY/COMMENT PAGE LOGIC
app.post("/forums/:forum_id/threads/:threads_id", function(req, res){
	// console.log("reply thread page logic fired");
	// console.log(req.body.reply);
	// console.log(req.body.vote);
	// console.log(req.body.currentVotes);
	var oldVotes = parseInt(req.body.currentVotes);
	// console.log("parsed", oldVotes);
	if (req.body.vote == 1){
		db.run("UPDATE threads SET votes=? WHERE id=?",
			oldVotes + 1, req.params.threads_id,
			function(err){
				if(err){
					console.log(err);
				}else{
					// console.log("threads table updated with new vote");
				}
			});
	}
	db.run("INSERT INTO replies (content, threads_id) VALUES (?,?)",
		req.body.reply, req.params.threads_id,
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
	console.log("new thread logic fired");
	console.log(req.params.id);
	db.run("INSERT INTO threads (title, votes, interests_id) VALUES (?,?,?)",
		req.body.newThread, 0, req.params.id,
		function(err){
			if (err){
				console.log(err);
			}else{
				console.log("new thread inserted");
			}
		})
	res.redirect("/forums/" + req.params.id + "/threads")
});




//DELETE
//there isn't really any deleting on a forum? once it's there, it's there.









