 import express from "express";
import auth from "../middlewares/auth";
import {registerController,loginController,dashboardController,refreshTokenController } from "../controllers";


 const router= express.Router();

router.post('/register',registerController.register);
router.post('/login',loginController.login)
router.get('/dashboard',auth, dashboardController.dashboard)
router.post('/refresh-token',refreshTokenController.refreshToken)
router.post('/logout',auth,loginController.logout)




  
 export default router;
