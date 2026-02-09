
import "./chat.scss";
import ChatComponent from "../../components/chatComponent/ChatComponent";
import UserType from "../../types/UserType";
import ChatType from "../../types/ChatType";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatCreate from "../../components/chatCreate/ChatCreate";

interface ChatProps {
    currentUser: UserType;
    selectedUser: UserType | null;
    users: UserType[];
    chats: ChatType[];
}

const Chat: React.FC<ChatProps> = ({ currentUser, selectedUser }) => {
    const [chats, setChats] = useState<ChatType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const baseurl = import.meta.env.VITE_API_URL;
    //const baseurl = "http://localhost:3001";

    useEffect(() => {
        const fetchChats = async () => {
            if (currentUser && selectedUser) {
                setError(null);
                try {
                    const response = await axios.get(`${baseurl}/chats`, {
                        params: { user1: currentUser.id, user2: selectedUser.id },
                    });
                    setChats(response.data);
                } catch (error) {
                    setError("Error fetching chats");
                }
            }
        };

        fetchChats();
    }, [currentUser, selectedUser]);

    if (error) {
        return <div>{error}</div>;
    }

    const handleChatCreated = (newChat: ChatType) => {
        setChats(prevChats => [...prevChats, newChat]);
    };

    return (
        <div className="chat">
            <ChatCreate currentUser={currentUser} onChatCreated={handleChatCreated}/>
            {currentUser && selectedUser && (
                <ChatComponent
                    currentUser={currentUser}
                    selectedUser={selectedUser}
                    chats={chats}
                />
            )}
        </div>
    );
};

export default Chat;
