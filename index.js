import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import { connection, sequelize } from "./App/Config/Database.js";
import router from "./App/Routes/Api.js";
import setupAssociations from "./App/Models/SetupAssociations.js";

dotenv.config();
const PORT = process.env.port;
const app = express();

const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    rolling: true,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.use(router);

setupAssociations();
connection();
app.listen(PORT, () => {
  console.log("Server up and running...");
});
