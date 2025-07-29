import express from "express";
import { searchcontroller } from "../controllers/search.js";
import { asyncWrapper } from "../middlewares.js";
const router = express.Router({ mergeParams: true });

router.get("/", asyncWrapper(searchcontroller));


export default router;