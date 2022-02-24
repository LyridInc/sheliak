import { WebSocketLink } from '@apollo/client/link/ws';
import { AuthConstant } from 'constants/index';
import logger from 'helpers/Utils/loggerHelper';

const wsLink = new WebSocketLink({
	uri: process.env.REACT_APP_BACKEND_ENGINE_WS,
	options: {
		reconnect: true,
		connectionParams: () => {
			const tokenJWT = localStorage.getItem(AuthConstant.AUTH_TOKEN);

			return {
				headers: {
					Authorization: tokenJWT ? `JWT ${tokenJWT}` : '',
				},
			};
		},
		lazy: true,
		connectionCallback: (error) => {
			logger.logger('Websocket Error: ', error);
		},
	},
});

export default wsLink;
