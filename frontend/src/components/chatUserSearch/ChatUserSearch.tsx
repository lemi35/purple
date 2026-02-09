
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserType from '../../types/UserType';
import "./chatUserSearch.scss";

interface ChatUserSearchProps {
    onUserForChatSelect: (user: UserType) => void;
}

const ChatUserSearch: React.FC<ChatUserSearchProps> = ({ onUserForChatSelect }) => {
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

    const handleUserClick = (user: UserType) => {
        setSearchQuery(user.username);
        onUserForChatSelect(user);
        console.log("Passed USER:", user)
    };

    return (
        <div className="search">
            <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <ul className="search-results">
                    {filteredUsers.map((user) => (
                        <li
                            key={user.id}
                            className="chat-user"
                            /* onClick={() => onUserForChatSelect(user)} */
                            onClick={() => handleUserClick(user)}

                        >
                            <div className="user-info">
                                <img 
                                    src={user.profileImage} 
                                    alt={user.username} 
                                    width={40} 
                                    height={40} 
                                />
                                <span>{user.username}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChatUserSearch;
