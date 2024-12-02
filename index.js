import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import { connection, sequelize } from "./App/Config/Database.js";
import setupAssociations from "./App/Models/SetupAssociations.js";
import router from "./App/Routes/Api.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    rolling: true,
    cookie: {
      secure: false,
      httpOnly: false,
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
