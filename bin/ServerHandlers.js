const DestroyServerOnError = async function(server, msg) {
	console.log(msg);

	try {
		await server.destroy();
	} catch (err) { console.log(new Error(err).message); }
};

module.exports = {
	DestroyServerOnError: DestroyServerOnError
};
