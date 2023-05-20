// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/InstaBook-data');
  console.log("Database connceted");
   //use 
   //await mongoose.connect('mongodb://user:password@127.0.0.1:27017/InstaBook-data'); 
  //if your database has auth enabled
}