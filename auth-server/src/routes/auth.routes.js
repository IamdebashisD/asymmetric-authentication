import { Router } from 'express'
import { RegisterDto } from '../dto/register.dto.js'
import { LoginDto } from '../dto/login.dto.js' 
import { validate } from '../middleware/validate.js'
import * as authcontroller from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'


const router = Router()

router.post('/register', validate(RegisterDto), authcontroller.register)
router.post('/login', validate(LoginDto), authcontroller.login)
router.get('/profile', authMiddleware, authcontroller.profile)
router.post('/refresh-token', authcontroller.refreshToken)
router.post('/logout', authcontroller.logout)

export default router
