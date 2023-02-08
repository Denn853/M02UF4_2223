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
  .catch(msg => console.error(msg));

function send_characters (response) {
	let collection = db.collection('characters');
	
	collection.find({}).toArray().then(
		character => { 
			let names = [];
			for (let i = 0; i < characters.length; i++) {
				names.push(characters[i].name);
			}
			
			response.write(JSON.stringify(names));
			response.end();
		}	
	);
}

function send_age (response, url) {
	
	if (url.length < 3) {
		response.write("ERROR: Edad Erronea");
		response.end();
		return;
	}

	let collection = db.collection('characters');
	
	collection.find({"name":url[2]}).toArray().then(character => {
			let data = {
				age: character[0].age
			};

			response.write(JSON.stringify(data));
			response.end();
		}	
	);

}

const http = require('http');

http.createServer(
	function(request, response){
		if (request.url == "/favicon.ico") {
			return;
		}

		let url = request.url.split("/");
		
		switch (url[1]){
			case "characters":
				send_characters(response);
				break;
				
			case "age":
				send_age(response, url);
				break;
				
			default:
				response.write("Página Principal");
				response.end();
		}


console.log(request.url);
		
	/*	console.log('Alguien se conecta');
		console.log(collection); */
}

).listen(8080);











