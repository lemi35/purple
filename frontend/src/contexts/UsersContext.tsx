
import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import UserType from "../types/UserType";

interface UsersContextType {
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const baseurl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/users/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContext;