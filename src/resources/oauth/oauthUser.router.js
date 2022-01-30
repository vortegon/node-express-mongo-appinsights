import { Router } from 'express';
import { catchErrors } from '../../utils/errorHandler.js';
import { createUser, findById, find, deleteById, updateById } from './oauth.controllers.js';

const router = Router();

router.post('/', catchErrors(createUser));
router.get('/:id', catchErrors(findById));
router.get('/', catchErrors(find));
router.delete('/:id', catchErrors(deleteById));
router.put('/:id', catchErrors(updateById));

export default router;
