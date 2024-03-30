import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  login: (email: string, password: string) => Promise<string>;
  register: (
    name: string,
    email: string,
    password: string,
    confirm_password: string
  ) => Promise<string>;
  logout: () => void;
  isLoading: boolean;
  userToken: string | null;
}

export const AuthContext = createContext<AuthContextProps>({
  login: (email: string, password: string) => Promise.resolve(""),
  register: (
    name: string,
    email: string,
    password: string,
    confirm_password: string
  ) => Promise.resolve(""),
  logout: () => {},
  isLoading: false,
  userToken: null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  interface LoginResponse {
    token: string;
  }

  interface ErrorResponse {
    message: string;
  }

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      setUserToken(response.data.token);
      AsyncStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (error: any) {
      const errorResponse = error.response.data as ErrorResponse;
      throw new Error(errorResponse.message);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirm_password: string
  ): Promise<string> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.BASE_URL}/auth/register`,
        {
          name,
          email,
          password,
          confirm_password,
        }
      );
      setUserToken(response.data.token);
      AsyncStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (error: any) {
      const errorResponse = error.response.data as ErrorResponse;
      throw new Error(errorResponse.message);
    }
  };
  //TODO: Really logout not just remove token
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("token");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("token");
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, register, isLoading, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
