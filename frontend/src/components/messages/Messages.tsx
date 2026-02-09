import { useState, useEffect } from "react";
import MessageType from "../../types/MessageType";
import UserType from "../../types/UserType";
import ChatType from "../../types/ChatType";
import WriteMessage from "./WriteMessage";

interface MessagesProps {
    users: UserType[];
    currentUser: UserType;
    selectedUser: UserType | null;
}

const Messages: React.FC<MessagesProps> = ({ currentUser, users, selectedUser }) => {
    const baseurl = "http://localhost:3001"; 
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [chatId, setChatId] = useState<number | null>(null);

    // Get chatId between currentUser and selectedUser
    useEffect(() => {
        const fetchChatId = async () => {
            if (!selectedUser) return;

            try {
                const response = await fetch(
                    `${baseurl}/chats?user1=${currentUser.id}&user2=${selectedUser.id}`
                );
                const chat: ChatType | null = await response.json();
                if (chat) setChatId(chat.chat_id);
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        fetchChatId();
    }, [selectedUser, currentUser]);

    // Fetch messages for the current chatId
    useEffect(() => {
        const fetchMessages = async () => {
            if (chatId === null) return;

            try {
                const response = await fetch(`${baseurl}/messages/${chatId}`);
                const data: MessageType[] = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [chatId]);

    return (
        <div className="chat-messages">
            {messages.map((message, index) => {
                const sender = users.find(user => user.id === message.sender_id);
                const isCurrentUserSender = message.sender_id === currentUser.id;

                if (!sender) return null;

                const previousMessage = messages[index - 1];
                const showProfileImageAndDate =
                    !previousMessage || previousMessage.sender_id !== message.sender_id;

                return (
                    <div
                        key={index}
                        className={`message ${isCurrentUserSender ? "outgoing" : "incoming"}`}
                    >
                        {showProfileImageAndDate ? (
                            <img src={sender.profileImage} alt={sender.username} />
                        ) : (
                            <div className="image-placeholder" />
                        )}
                        <div className="content">
                            <div className="user-details">
                                {showProfileImageAndDate && (
                                    <span className="u-username">{sender.username}</span>
                                )}
                                {showProfileImageAndDate && (
                                    <span className="date">
                                        {new Date(message.created_at).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="message-content">{message.content}</div>
                        </div>
                    </div>
                );
            })}
            <WriteMessage
                currentUser={currentUser}
                setMessages={setMessages}
                chatId={chatId}
                messages={messages}
            />
        </div>
    );
};

export default Messages;
