const generarToken = () => {
	const token = Date.now().toString(32) + Math.random().toString(32).substring(2);

	return token;
}

export default generarToken;

