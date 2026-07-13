import { Router } from 'express'
import * as jwksController from '../controllers/jwks.controller.js'

const router = Router()

router.get('/.well-known/jwks.json', jwksController.getJWKS)

export default router
