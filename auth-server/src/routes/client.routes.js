import * as clientController from '../controllers/client.controller.js'
import { clientDto } from '../dto/client.dto.js'
import { validate } from '../middleware/validate.js'
import { Router } from 'express'

const router = Router()

router.get('/', clientController.getAllClients)

router.get('/:clientId', clientController.getClientById)

router.post('/client', validate(clientDto), clientController.createClient)

router.put('/:clientId', clientController.updateClient)

router.delete('/:clientId', clientController.deleteClient)

export default router