import  express  from "express";
import { google, signin, signout, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google); // if this request was made then call the google function
router.get('/signout',signout);

export default router;