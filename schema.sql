DROP TABLE IF EXISTS interests;
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS replies;
DROP TABLE IF EXISTS users;

CREATE TABLE interests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT,
	class TEXT
);

CREATE TABLE threads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT,
	votes INTEGER,
	user_id INTEGER,
	interests_id INTEGER
);

CREATE TABLE replies (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	content TEXT,
	threads_id INTEGER,
	username TEXT,
	timestamp datetime default current_timestamp
);

CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	password TEXT,
	photo TEXT
);





