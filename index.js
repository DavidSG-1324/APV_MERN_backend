import express from "express";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

import cors from 'cors';

import dotenv from "dotenv";
dotenv.config();

const app = express();

// Body Parser
app.use(express.json());

// Conexión a la Base de Datos
conectarDB();

// Definir Dominios Permitidos
const dominios = [
	// 'http://127.0.0.1:5173',
	process.env.FRONTEND_URL,
	'http://localhost:4000'
];

const corsOptions = {
	origin: function(origin, callback) {
		if(dominios.indexOf(origin) !== -1) {
			// Origen permitido del request
			callback(null, true);
		} else {
			callback(new Error('No permitido por CORS'));
		}
	}
}

app.use(cors(corsOptions));

// Definir puerto
const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`El Servidor está funcionando en el puerto ${port}`);	
});

// Agregar Router
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

