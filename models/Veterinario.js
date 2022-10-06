import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarToken from "../helpers/generarToken.js";

const veterinarioSchema = mongoose.Schema({
	nombre: {
		type: String, 
		trim: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	telefono: {
		type: String,
		trim: true,
		default: null
	},
	web: {
		type: String,
		default: null
	},
	confirmado: {
		type: Boolean,
		default: false
	},
	token: {
		type: String,
		default: generarToken()
	}
});

veterinarioSchema.pre('save', async function(next) {
	if(!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function(passwordForm) {
	const compare = await bcrypt.compare(passwordForm, this.password);

	return compare;
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;

