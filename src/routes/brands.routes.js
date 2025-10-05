import { Router } from "express";
import { getAllBrands } from "../controller/client.controller.js";

const brandsRouter = Router();

brandsRouter.get('/', getAllBrands);

export default brandsRouter;