import * as clientController from '../controllers/client.controller.js'
import { clientDto } from '../dto/client.dto.js'
import { validate } from '../middleware/validate.js'
import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'


const router = Router()

router.get('/', authMiddleware, adminMiddleware, clientController.getAllClients)

router.get('/:clientId', authMiddleware, adminMiddleware, clientController.getClientById)

router.post('/client', authMiddleware, adminMiddleware, validate(clientDto), clientController.createClient)

router.put('/:clientId', authMiddleware, adminMiddleware, clientController.updateClient)

router.delete('/:clientId', authMiddleware, adminMiddleware, clientController.deleteClient)

export default router