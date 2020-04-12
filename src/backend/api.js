import express from "express";

const api = express.Router();

api.get("/", (req, res) => res.sendStatus(200));

export default api;