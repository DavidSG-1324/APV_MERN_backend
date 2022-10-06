import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (request, response, next) => {
	let tokenJwt;

	if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
		try {
			tokenJwt = request.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(tokenJwt, process.env.JWT_SECRET);

			request.veterinario = await Veterinario.findById(decoded.id).select(
					'-password -confirmado -token'
				);

			// next();
		} catch {
			const error = new Error('Token no válido');
			response.status(403).json({msg: error.message});
		}
	}

	if(!tokenJwt) {
		const error = new Error('Token no válido o inexistente');
		response.status(403).json({msg: error.message});
	}

	next();
}

export default checkAuth;

