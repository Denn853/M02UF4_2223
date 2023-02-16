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
	
	collection.find({}).toArray().then(characters => { 
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
	
	collection.find({"name":url[2]}).project({_id:0, age:1}).toArray().then(character => {
		if (character.length == 0) {
			response.write("ERROR: Edad Erronea");
			response.end();

			return;
		}

		response.write(JSON.stringify(character[0]));
		response.end();
		}	
	);
}

function send_items (response) {
   let collection = db.collection('items');

   collection.find({}).toArray().then(items => {
         let name = [];
         for (let i = 0; i < items.length; i++) {
            name.push(items[i].item);
         }

         response.write(JSON.stringify(name));
         response.end();
      }
   );
}

function send_characters_items (response, url) {

	let collection = db.collection("characters");

	collection.find({ "name": url[2] }).project({ _id: 0, id_character: 1 }).toArray()
		.then(idCharacter => {

			console.log(idCharacter);
		
			let collection = db.collection("characters_items");
			
			collection.find({ "id_character": idCharacter[0].id_character }).project({ _id: 0, id_item: 1 }).toArray()
				.then(idItem => {
					
					console.log(idItem);
					
					let collection = db.collection("items");
					let itemsName = [];

					for (let i = 0; i < idItem.length; i++) {
						collection.find({ "id_item": idItem[i].id_item }).project({ _id: 0, item: 1 }).toArray()
							.then(item => {
								itemsName.push(item[0].item);
								console.log(item);
							});
					}

					setTimeout(() => {
						response.write(JSON.stringify(itemsName));
						response.end();
					}, 1000);
				});
		});
}


const http = require('http');
const fs = require("fs");

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

			case "items":
				if (url[2]) {
					send_characters_items(response, url);
					break;
				}

            send_items(response);
            break;

			default:
				fs.readFile("index.html", function(err, data) {
					if (err) {
						console.error(err);
						response.writeHead(404, {"Content-Type":"text/html"});
						response.write("Errot 404: el arcvhivo no está en este castillo");
						response.end();
						return;
					}
					
					response.writeHead(200, {"Content-Type":"text/html"});
					response.write(data);
         		response.end();
				});
		}

		
		
console.log(request.url);
		
	/*	console.log('Alguien se conecta');
		console.log(collection); */
}

).listen(8080);

