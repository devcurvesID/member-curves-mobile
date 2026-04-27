import { api } from "@/lib/axios";
import { tokenCache } from "@/utils/cache";
import React from "react";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  signInWithUsernamePassword: (
    username: string,
    password: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const cek_usertoken = async () => {
      const token = await tokenCache?.getToken("accessToken");
      if (token) {
        const req_user_pengguna = await api.get("/auth/me");
        const data_user = req_user_pengguna.data;
        setUser(data_user);
      }
    };
    cek_usertoken();
  }, []);
  const signInWithUsernamePassword = async (
    username: string,
    password: string,
  ) => {
    try {
      if (!username) {
        throw new Error("email / username tidak boleh kosong");
      }
      if (!password) {
        throw new Error("password tidak boleh kosong");
      }
      setIsLoading(true);
      const login_user = await api.post("/auth/login/member", {
        username,
        password,
      });
      const {
        data: { response },
      } = login_user;
      setAccessToken(response.token);
      setRefreshToken(response.token);
      await tokenCache?.saveToken("accessToken", response.token);
      await tokenCache?.saveToken("refreshToken", response.token);
      const req_user_pengguna = await api.get("/auth/me");
      const data_user = req_user_pengguna.data;
      setUser(data_user);
    } catch (error: any) {
      console.log("error :", error.error);
      alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await tokenCache?.deleteToken("accessToken");
    await tokenCache?.deleteToken("refreshToken");

    // Clear state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithUsernamePassword, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
