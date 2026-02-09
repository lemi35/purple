import { useState, useEffect } from 'react';
import axios from 'axios';
import UserType from '../../types/UserType';
import "./userSearch.scss";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

interface UserSearchProps {
    users: UserType[];
    onUserSelect: (user: UserType) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<UserType[]>([]);
    //const baseurl = 'http://localhost:3001';
    const baseurl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseurl}/users`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="search">
            <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon path={mdiMagnify} size={1} color="grey" />
            {searchQuery && (
                <ul className="search-results">
                    {filteredUsers.map((user) => (
                        <li
                            key={user.id}
                            className="chat-user"
                            onClick={() => onUserSelect(user)}
                        >
                            <Link to={`/profile/${user.id}`} className="user-link">
                                <div className="user-info">
                                    <img
                                        src={user.profileImage}
                                        alt={user.username}
                                        width={40}
                                        height={40}
                                    />
                                    <span>{user.username}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearch;
