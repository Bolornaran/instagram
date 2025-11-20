"use client";
import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useState } from "react";
import { useEffect } from "react";
//import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  _id: string;
};

type DecodedToken = {
  data: {
    _id: string;
    email: string;
    username: string;
    bio: string | null;
    profilePicture: string | null;
    password: string;
  };
};

type AuthContext = {
  user: User | null;
  token: string | null;
  setToken: Dispatch<SetStateAction<null | string>>;
  setUser: Dispatch<SetStateAction<null | User>>;
  login: (password: string, email: string) => Promise<void>;
};

type decodedTokenType = {
  data: User;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      const decodedToken: DecodedToken = jwtDecode(token);
      setUser(decodedToken.data);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const user = await response.json();
    setToken(user);
    localStorage.setItem("token", JSON.stringify(user));
  };

  const values = {
    login: login,
    user: user,
    setUser: setUser,
    token,
    setToken,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("!!PROVIDER!!");
  }

  return authContext;
};
