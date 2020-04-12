import express from "express";
import api from "./api.js";

const app = express();

app.use("/", express.static("./build"));
app.use("/api", api)

app.listen(8080, () => console.log("Server listening"));