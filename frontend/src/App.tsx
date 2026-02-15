import { ReactNode, useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
	Navigate
} from "react-router-dom";
import LeftBar from "./components/leftbar/LeftBar";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import UserProfile from "./pages/profile-pages/UserProfile";
import MyProfile from "./pages/profile-pages/MyProfile";
import Register from "./pages/register/Register";
import Friends from "./pages/friends/Friends";
import Chat from "./pages/chat/Chat";
import ProfileUpdate from "./components/profile/profileUpdate/ProfileUpdate";
import axios from "axios";
import "./style.scss";
import UserType from "./types/UserType";
import ChatLeftBar from "./components/chatLeftBar/ChatLeftBar";
import Users from "./pages/users/Users";
import ChatType from "./types/ChatType";
import Topic from "./pages/topic/Topic";
import Community from "./pages/community/Community";
import { UsersProvider } from "./contexts/UsersContext";
import userContext from "./contexts/UserContext";

//import CommunityType from "./types/CommunityType";



function App() {
	//const usernameFromCookie = document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1];
	//const roleFromCookie = document.cookie.split("; ").find((row) => row.startsWith("role="))?.split("=")[1];

	const [currentUser, setCurrentUser] = useState<UserType | null>(null);
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [/*chatId*/, setChatId] = useState<string | null>(null);
	const [users, /*setUsers*/] = useState<UserType[]>([]);
	const [chats, /*setChats*/] = useState<ChatType[]>([]);
	const [clickedUser, setClickedUser] = useState<UserType | null>(null);
	const [contextUsername, setContextUsername] = useState<string | null>(null);
	const [contextRole, setContextRole] = useState<string | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);


	//const [communities, setCommunities] = useState<CommunityType[]>([]);
	


	const handleUserSelect = (user: UserType) => {
		setSelectedUser(user);
	};

	const handleUserClick = (user: UserType) => {
		setClickedUser(user);
	};


	const baseurl = import.meta.env.VITE_API_URL;

	//const baseurl = "http://localhost:3001";

	useEffect(() => {
	const fetchCurrentUser = async () => {
		try {
			const response = await axios.get(`${baseurl}/users/me`, {
				withCredentials: true,
			});

			setCurrentUser(response.data);
			setContextUsername(response.data.username);
			setContextRole(response.data.role);
		} catch (error) {
			setCurrentUser(null);
		} finally {
			setLoadingUser(false);
		}
	};

	fetchCurrentUser();
}, []);



	useEffect(() => {
		const fetchChat = async () => {
			if (currentUser && selectedUser) {
				try {
					const response = await axios.get(`${baseurl}/chats`, {
						params: { user1: currentUser.id, user2: selectedUser.id },
						withCredentials: true,
					});
					setChatId(response.data.chatId);
				} catch (error) {
					console.error("Error fetching chat:", error);
				}
			}
		};

		fetchChat();
	}, [currentUser, selectedUser]);

	const Layout = ({ children }: { children?: ReactNode }) => {
		return (
			<div className="theme-light">
				<div className="layout-container">
					<NavBar currentUser={currentUser} onUserSelect={handleUserClick} selectedUser={selectedUser} />
					<div style={{ display: "flex" }}>
						<LeftBar />
						<div style={{ flex: 6 }}>
							<Outlet />
							{children}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const ChatLayout = ({ children }: { children?: ReactNode }) => {
		return (
			<div className="theme-light">
				<div className="layout-container">
					<NavBar currentUser={currentUser} onUserSelect={handleUserClick} selectedUser={selectedUser} />
					<div style={{ display: "flex" }}>
						{currentUser && (<ChatLeftBar
							currentUser={currentUser}
							onUserSelect={handleUserSelect}
						/>
						)}
						<div style={{ flex: 6 }}>
							<Outlet />
							{currentUser && (
								<Chat
									currentUser={currentUser}
									selectedUser={selectedUser}
									chats={chats}
									users={users}
								/>
							)}
							{children}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	if (loadingUser) return null; // or spinner

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
	};

	console.log("App currentUser:", currentUser);


	return (
		<userContext.Provider value={{ 
				contextUsername, 
				setContextUsername, 
				contextRole, 
				setContextRole, 
				currentUser, 
				setCurrentUser }}>
			<UsersProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route path="/" element={<Home />} />
							<Route path="profile/my"
  								element={<MyProfile currentUser={{ username: "test" } as any} />} />
							<Route path="profile/:id"
								element={<UserProfile user={clickedUser} />} />
							<Route path="friends" element={<Friends user={clickedUser} />} />
							<Route path="users" element={<Users onUserSelect={handleUserClick} /* user={currentUser} */ />} />
							<Route
								path="profileUpdate"
								element={
									currentUser ? <ProfileUpdate currentUser={currentUser} /> : <Navigate to="/" />
								}
								/>
							<Route path="*" element={<div>Not Found</div>} />
							<Route path="topic" element={< Topic />} />
							<Route path="communities" element={<Community />} />
							<Route path="login" element={<Login />} />
							<Route path="register" element={<Register />} />
						</Route>

						<Route
							path="/chat/*"
							element={
								<ProtectedRoute>
									<ChatLayout />
								</ProtectedRoute>
							}
						/>


					</Routes>
				</Router>
			</UsersProvider>
		</userContext.Provider>
	);
}

export default App;