import { useState, useEffect } from "react";
import axios from "axios";
import UserType from "../../types/UserType";
import ChatType from "../../types/ChatType";
import Messages from "../../components/messages/Messages";
import ChatBanner from "../chatBanner/ChatBanner";

interface ChatComponentProps {
    currentUser: UserType;
    selectedUser: UserType | null;
    chats: ChatType[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ selectedUser, currentUser, chats }) => {
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
	//const baseurl = "http://localhost:3001"; 
    const baseurl = import.meta.env.VITE_API_URL;

    // Filter chats based on selectedUser
    useEffect(() => {
        if (selectedUser) {
            const chatWithSelectedUser = chats.find(chat => 
                (chat.user1_id === selectedUser.id && chat.user2_id === currentUser.id) ||
                (chat.user1_id === currentUser.id && chat.user2_id === selectedUser.id)
            );
            setSelectedChat(chatWithSelectedUser || null);
        }
    }, [selectedUser, currentUser, chats]);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseurl}/users`);
                /* console.log("Fetched users:", response.data); */
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="chat-page">
            {currentUser && selectedUser && selectedChat && (
                <>
                    <div className="banner">
                        <ChatBanner 
                            username={selectedUser.username} 
                            profileImage={selectedUser.profileImage} />
                    </div>
                    <div className="messages">
                        <Messages 
                            currentUser={currentUser} 
                            chats={chats} 
                            selectedUser={selectedUser} 
                            users={users} 
                            selectedChat={selectedChat} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatComponent;
