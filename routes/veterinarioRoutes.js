import express from 'express';

import {
	login,
	create,
	confirm,
	forgotten,
	recover,
	newPassword,
	perfil,
	actualizarPerfil,
	actualizarPassword
} from "../controllers/veterinarioController.js";

import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (request, response) => {
	response.json({msg: 'prueba...'});
});

// Área Pública
router.post('/', login)

router.post('/create-account', create);

router.get('/confirm-account:token', confirm);

router.post('/forgotten', forgotten);

// router.get('/recover/:token', recover);
// router.post('/recover/:token', newPassword);
router.route('/recover:token').get(recover).post(newPassword);

// Área Privada
router.get('/perfil', checkAuth, perfil); // Custom Middleware
router.put('/perfil:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;

