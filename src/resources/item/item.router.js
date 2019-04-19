import { Router } from 'express'

const router = Router()

router.route('/')
    .get(controller)
    .post(controller)    


//
router.route('/:id')
    .get(controller) 
    .put(controller)
    .delete(controller)    


export default router
