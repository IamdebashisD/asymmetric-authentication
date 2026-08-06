import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as oidcController from '../controllers/oidc.controller.js';

const router = Router()

router.get('/authorize', authMiddleware, oidcController.authorize)
router.post('/token', oidcController.token)
router.get('/userinfo', authMiddleware, oidcController.userInfo)
router.post("/revoke", oidcController.revoke)

export default router
