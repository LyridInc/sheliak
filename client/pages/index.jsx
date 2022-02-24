import { useState, useEffect } from 'react';

import { userService } from 'services';

export default Home;

function Home() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
    }, []);

    return (
        <div className="card mt-4">
            <h4 className="card-header">You're logged in with Sheliak!!</h4>
            <div className="card-body">
                <h6>Users from secure api end point</h6>
            </div>
        </div>
    );
}
