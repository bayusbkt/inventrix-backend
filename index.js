import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import { connection, sequelize } from "./Config/Database.js";
import router from "./Routes/Api.js";
import setupAssociations from "./Models/SetupAssociations.js";

dotenv.config();
const PORT = process.env.port;
const app = express();

const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({
  db: sequelize,
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
    saveUninitialized: true,
    store: store,
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
