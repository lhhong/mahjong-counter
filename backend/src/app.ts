import express from "express";
import api from "./api";

const app = express();

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static("./frontend/build"));
}

app.use("/api", api);

app.listen(process.env.PORT || 8080, () => console.log("Server listening"));
