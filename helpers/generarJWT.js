import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
	const jwToken = jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '30d'
	});

	return jwToken;
}

export default generarJWT;

