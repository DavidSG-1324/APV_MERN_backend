import nodemailer from 'nodemailer';

const emailCreateAccount = async (datos) => {
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
		subject: 'Confirma tu Cuenta',
		text: 'Confirma tu Cuenta',
		html: `
			<p>Hola ${nombre} has creado tu cuenta en APV, para terminar el registro sólo debes hacer Click en el siguiente enlace:</p>
			<p><a href="${process.env.FRONTEND_URL}/confirm-account:${token}">Confirmar Cuenta</a></p>
			<p>Si no creaste la cuenta puedes ignorar este mensaje.</p>
		`
	});

	console.log("Mensaje enviado: %s", info.messageId);
}

export default emailCreateAccount;

