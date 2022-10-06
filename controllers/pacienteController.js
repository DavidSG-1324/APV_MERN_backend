import Paciente from '../models/Paciente.js';

const agregarPaciente = async (request, response) => {
	const paciente = new Paciente(request.body);
	paciente.veterinario = request.veterinario._id;

	try {
		const pacienteSaved = await paciente.save();
		console.log(pacienteSaved);

		response.json(pacienteSaved);

	} catch(error) {
		console.log(error);
	}
}

const obtenerPacientes = async (request, response) => {
	const pacientes = await Paciente.find().where('veterinario').equals(request.veterinario);

	response.json(pacientes);
}

const obtenerPaciente = async (request, response) => {
	const {id} = request.params;

	try {
		const paciente = await Paciente.findById(id);

		if(paciente.veterinario._id.toString() !== request.veterinario._id.toString()) {
			const error = new Error('Acción no Válida');

			return response.status(403).json({msg: error.message});
		}

		console.log(paciente);

		response.json(paciente);

	} catch {
		const error = new Error('Paciente no encontrado');

		return response.status(400).json({msg: error.message});
	}
}

const actualizarPaciente = async (request, response) => {
	const {id} = request.params;

	try {
		const paciente = await Paciente.findById(id);

		if(paciente.veterinario._id.toString() !== request.veterinario._id.toString()) {
			const error = new Error('Acción no Válida');

			return response.status(403).json({msg: error.message});
		}

		paciente.nombre = request.body.nombre || paciente.nombre;
		paciente.propietario = request.body.propietario || paciente.propietario;
		paciente.email = request.body.email || paciente.email;
		paciente.fecha = request.body.fecha || paciente.fecha;
		paciente.sintomas = request.body.sintomas || paciente.sintomas;

		try {
			const pacienteActualizado = await paciente.save();

			response.json(pacienteActualizado);

		} catch(error) {
			console.log(error);
		}

	} catch {
		const error = new Error('Paciente no encontrado');

		return response.status(400).json({msg: error.message});
	}
}

const eliminarPaciente = async (request, response) => {
	const {id} = request.params;

	try {
		const paciente = await Paciente.findById(id);

		if(paciente.veterinario._id.toString() !== request.veterinario._id.toString()) {
			const error = new Error('Acción no Válida');

			return response.status(403).json({msg: error.message});
		}

		try {
			await paciente.deleteOne();

			response.json({msg: 'Paciente Eliminado Correctamente'});

		} catch(error) {
			console.log(error);
		}

	} catch {
		const error = new Error('Paciente no encontrado');

		return response.status(400).json({msg: error.message});
	}
}

export {
	agregarPaciente,
	obtenerPacientes,
	obtenerPaciente,
	actualizarPaciente,
	eliminarPaciente
}

