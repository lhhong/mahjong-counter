import express from "Express";

const api = express.Router();

api.get("/", (req, res) => res.sendStatus(200));

export default api;