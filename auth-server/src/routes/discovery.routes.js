import { Router } from 'express'
import * as discoveryController from '../controllers/discovery.controller.js'

const router = Router()

router.get(
    '/.well-known/openid-configuration', 
    discoveryController.getConfiguration
)

export default router
