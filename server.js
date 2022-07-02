import { createServer } from "http";
import app from "./app.js";
import mongoose from "mongoose";
import { socketServer } from "./socket/socketServer.js";

const server = createServer(app);
const port = process.env.PORT || 5000;

//Initialize Socket Server
socketServer(server);

// Connected With Db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  })
  .then(() => {
    console.log(`Db Connected`);
  });

//Listing Our Port
server.listen(port, () => {
  console.log(`Server Listing Port ${port}`);
});
