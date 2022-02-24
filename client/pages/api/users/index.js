import { apiHandler } from 'helpers/api';

// users in JSON file for simplicity, store in a db for production applications
export default apiHandler(handler);

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return res.status(200).json(req.user);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
