import nodemailer from 'nodemailer';

const emailForgotten = async (datos) => {
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
		    user: process.env.EMAIL_USER,
		    pass: process.env.EMAIL_PASS
		}
	});

	const {nombre, email, token} = datos;

	const info = await transport.sendMail({
		from: 'Adminitrador de Pacientes de Veterinaria',
		to: email,
		subject: 'Recupera tu Cuenta',
		text: 'Recupera tu Cuenta',
		html: `
			<p>Hola ${nombre} para recuperar tu cuenta sólo debes reestablecer tu Contraseña haciendo Click en el siguiente enlace:</p>
			<p><a href="${process.env.FRONTEND_URL}/recover:${token}">Recuperar Cuenta</a></p>
			<p>Si no solicitaste el cambio puedes ignorar este mensaje.</p>
		`
	});

	console.log("Mensaje enviado: %s", info.messageId);
}

export default emailForgotten;

