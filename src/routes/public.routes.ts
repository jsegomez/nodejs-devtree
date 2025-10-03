import { Router } from "express";
import { getPublicDataUser } from "../handler/user-handler";

const publicRoutes = Router();

publicRoutes.get("/:username", getPublicDataUser);

export default publicRoutes;


