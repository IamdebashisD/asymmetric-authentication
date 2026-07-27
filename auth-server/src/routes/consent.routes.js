import { Router } from 'express'
import * as consentController from '../controllers/consent.controller.js'

const router = Router()

router.get('/consent/:requestId', consentController.getConsent)

router.get('/consent/:requestId/approve', consentController.approveConsent)

router.get('/consent/:requestId/deny', consentController.denyConsent)

export default router