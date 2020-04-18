import express from "express";
import api from "./routers/api";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static("./frontend/build"));
}

app.use("/api", api);

app.listen(process.env.PORT || 8080, () => console.log("Server listening"));
