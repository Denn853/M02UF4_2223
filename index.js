#!/bin/node
//#!/usr/bin/env node

/*
function show_number(num) {
	console.log(num);
}

console.log("ola k ase")

for (let i = 0; i < 10; i++) {
	show_number(i);
}
*/

const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'abascal';

let db;

async function db_connect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);
  //const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'Conectados a la base de datos MongoDB.';
}

db_connect()
  .then(info => console.log(info))
  .catch(msg =>console.error(msg));


const http = require('http');

http.createServer(

	function(request, response){
	
		console.log('Alguien se conecta');
		let collection = db.collection('characters');
		console.log(collection);
		response.write('ola k ase');
		response.end();
}

).listen(8080);


