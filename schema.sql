DROP TABLE IF EXISTS interests;
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS replies;
DROP TABLE IF EXISTS users;

CREATE TABLE interests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT,
	class TEXT,
	photo TEXT
);

CREATE TABLE threads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	datestamp datetime NOT NULL DEFAULT NOW(),
	title TEXT,
	votes INTEGER,
	user_id INTEGER
	interests_id INTEGER,
);

CREATE TABLE replies (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	datestamp datetime NOT NULL DEFAULT NOW(),
	content TEXT,
	threads_id INTEGER,
	user_id INTEGER
);

CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	datestamp datetime NOT NULL DEFAULT NOW(),
	name TEXT,
	password TEXT,
	photo TEXT
);





