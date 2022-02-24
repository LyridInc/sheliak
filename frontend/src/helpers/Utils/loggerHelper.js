const logger = function logger(...messages) {
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line
		console.log(messages.join(''));
	}
};
exports.logger = logger;
