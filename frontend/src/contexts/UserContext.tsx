
import { createContext } from "react";
import UserType from "../types/UserType";


export interface UserContextType {
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  contextUsername: string | undefined;
  setContextUsername: (username: string | undefined) => void;
  contextRole?: string;
  setContextRole: (role?: string) => void;
}

const userContext = createContext<UserContextType | null>(null);

export default userContext;
