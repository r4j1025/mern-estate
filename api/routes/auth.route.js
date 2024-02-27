import  express  from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google); // if this request was made then call the google function

export default router;