import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarToken from '../helpers/generarToken.js';
import emailCreateAccount from '../helpers/emailCreateAccount.js';
import emailForgotten from '../helpers/emailForgotten.js';

const login = async (request, response) => {
	const {email, password} = request.body;

	// Revisar si el Usuario existe
	const veterinarioExist = await Veterinario.findOne({email});

	if(!veterinarioExist) {
		const error = new Error('El Usuario no está registrado');

		return response.status(400).json({msg: error.message});
	}

	// Revisar si la Cuenta está confirmada
	if(!veterinarioExist.confirmado) {
		const error = new Error('La Cuenta aún no está confirmada');

		return response.status(400).json({msg: error.message});
	}

	// Revisar si el Password es correcto
	if(await veterinarioExist.comprobarPassword(password)) {
		const id = veterinarioExist.id;

		// Autenticar al Usuario
		// response.json({jwt: generarJWT(id)});

		response.json({
			_id: veterinarioExist._id,
			nombre: veterinarioExist.nombre,
			email: veterinarioExist.email,
			telefono: veterinarioExist.telefono,
			web: veterinarioExist.web,
			jwt: generarJWT(id)
		});

	} else {
		const error = new Error('La Contraseña es incorrecta');

		return response.status(403).json({msg: error.message});
	}
}

const create = async (request, response) => {
	console.log(request.body);

	const {nombre, email, password} = request.body;
	console.log(nombre, email, password);

	// Revisar si el Usuario existe
	                                          // {email: email}
	const veterinarioExist = await Veterinario.findOne({email});

	if(veterinarioExist) {
		const error = new Error('El Usuario ya está registrado');

		return response.status(400).json({msg: error.message});
	}

	try {
		const veterinario = new Veterinario(request.body);
		veterinario.token = generarToken();

		// Guardar en la Base de Datos
		const veterinarioSaved = await veterinario.save();
		console.log(veterinarioSaved);
		
		response.json(veterinarioSaved);

		// Enviar Email
		emailCreateAccount({
			nombre,
			email,
			token: veterinarioSaved.token
		});

	} catch(error) {
		console.log(error);
	}
}

const confirm = async (request, response) => {
	console.log(request.params);

	let {token} = request.params;
	token = token.split(':')[1];

	const veterinario = await Veterinario.findOne({token});

	if(!veterinario) {
		const error = new Error('Token no válido');

		return response.status(400).json({msg: error.message});
	}

	try {
		// Modificar Registro
		veterinario.confirmado = true;
		veterinario.token = null;

		await veterinario.save();
	
		response.json({msg: 'Cuenta confirmada'});

	} catch(error) {
		console.log(error);
	}
}

const forgotten = async (request, response) => {
	const {email} = request.body;

	// Revisar si el Usuario existe
	const veterinarioExist = await Veterinario.findOne({email});

	if(!veterinarioExist) {
		const error = new Error('El Usuario no está registrado');

		return response.status(400).json({msg: error.message});
	}

	// Revisar si la Cuenta está confirmada
	if(!veterinarioExist.confirmado) {
		const error = new Error('La Cuenta aún no está confirmada');

		return response.status(403).json({msg: error.message});
	}

	try {
		// Crear Token
		veterinarioExist.token = generarToken();

		// Guardar en la Base de Datos
		const veterinarioSaved = await veterinarioExist.save();

		// Enviar Email
		emailForgotten({
			nombre: veterinarioSaved.nombre,
			email,
			token: veterinarioSaved.token
		});

		response.json({msg: 'Hemos enviado las instrucciones de recuperación de Cuenta a tu email'});

	} catch(error) {
		console.log(error);
	}	
}

const recover = async (request, response) => {
	let {token} = request.params;
	token = token.split(':')[1];

	const veterinarioExist = await Veterinario.findOne({token});

	if(veterinarioExist) {
		response.json({msg: 'Completa los Campos'});
	} else {
		const error = new Error('Error en el Enlace');

		return response.status(400).json({msg: error.message});
	}
}

const newPassword = async (request, response) => {
	let {token} = request.params;
	token = token.split(':')[1];

	const {password} = request.body;

	const veterinario = await Veterinario.findOne({token});

	if(!veterinario) {
		const error = new Error('Error en el Enlace');

		return response.status(400).json({msg: error.message});
	}

	try {
		// Modificar Registro
		veterinario.token = null;
		veterinario.password = password;

		// Guardar en la Base de Datos
		const veterinarioSaved = await veterinario.save();

		response.json({msg: 'Ahora puedes iniciar Sesión con tu Nueva Contraseña'});

	} catch(error) {
		console.log(error);
	}
}

const perfil = (request, response) => {
	const {veterinario} = request;

	// response.json({perfil: veterinario});
	response.json(veterinario);
}

const actualizarPerfil = async (request, response) => {
	let {id} = request.params;
	id = id.split(':')[1];

	const veterinario = await Veterinario.findById(id);

	if(!veterinario) {
		const error = new Error('Acción no Válida');

		return response.status(403).json({msg: error.message});
	}

	const {email} = request.body;
	if(veterinario.email !== email) {
		const existeEmail = await Veterinario.findOne({email});

		if(existeEmail) {
			const error = new Error('Email registrado anteriormente, utiliza otro');

			return response.status(403).json({msg: error.message});
		}
	}

	veterinario.nombre = request.body.nombre
	veterinario.email = request.body.email
	veterinario.telefono = request.body.telefono
	veterinario.web = request.body.web

	try {
		const veterinarioActualizado = await veterinario.save();

		response.json(veterinarioActualizado);

	} catch(error) {
		console.log(error);
	}
}

const actualizarPassword = async (request, response) => {
	const {_id} = request.veterinario;
	const {actual, nuevo} = request.body;

	// Revisar si el Usuario existe
	const veterinario = await Veterinario.findById(_id);

	if(!veterinario) {
		const error = new Error('Acción no Válida');

		return response.status(403).json({msg: error.message});
	}

	// Revisar si el Password es correcto
	if(await veterinario.comprobarPassword(actual)) {
		try {
			// Modificar Registro
			veterinario.password = nuevo;

			// Guardar en la Base de Datos
			const veterinarioSaved = await veterinario.save();

			response.json({msg: 'Contraseña actualizada correctamente'});

		} catch(error) {
			console.log(error);
		}

	} else {
		const error = new Error('La Contraseña Actual es incorrecta');

		return response.status(403).json({msg: error.message});
	}
}

export {
	login,
	create,
	confirm,
	forgotten,
	recover,
	newPassword,
	perfil,
	actualizarPerfil,
	actualizarPassword
}

