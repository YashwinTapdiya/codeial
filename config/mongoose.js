const mongoose = require("mongoose");
const env = require("./environment");

main().catch((error) => console.log("Error in connecting to database", error));

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
  console.log("Database connceted");
}
