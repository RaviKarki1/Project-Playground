import express from "express";

import { signupControl, loginControl, logoutControl } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', signupControl);

router.post('/login', loginControl);


router.post('/logout', logoutControl);



export default router;