import { createUploadLink } from 'apollo-upload-client';

const httpUploadLink = new createUploadLink({
	uri: process.env.REACT_APP_BACKEND_ENGINE_HTTP,
});

export default httpUploadLink;
