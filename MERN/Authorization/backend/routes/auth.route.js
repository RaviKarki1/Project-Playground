import express from 'express';

const router = express.Router();
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

// router.get('/login', (req, res) => {
//     res.send('login route');
// })

// router.get("/signup", (req, res) => {
//     res.send("signup route");
// });

// router.get("/signout", (req, res) => {
//     res.send("logout route");
// })

// importing the callbacks from the controller
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

