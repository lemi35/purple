import { createContext } from "react";
import UserType from "../types/UserType";

interface UserContextType {
  contextUsername: string | null;
  setContextUsername: React.Dispatch<React.SetStateAction<string | null>>;
  contextRole: string | null;
  setContextRole: React.Dispatch<React.SetStateAction<string | null>>;
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const userContext = createContext<UserContextType>({
  contextUsername: null,
  setContextUsername: () => {},
  contextRole: null,
  setContextRole: () => {},
  currentUser: null,
  setCurrentUser: () => {},
});

export default userContext;
