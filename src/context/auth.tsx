import { validatePhoneNumber } from "@/helpers";
import { api } from "@/lib/axios";
import { tokenCache } from "@/utils/cache";
import { router } from "expo-router";
import React from "react";

interface AuthContextType {
  user: any;
  userPhone: any;
  setUserPhone: (data: any) => void;
  isLoading: boolean;
  signInWithUsernamePassword: (
    username: string,
    password: string,
  ) => Promise<void>;
  checkNumberPhoneUser: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUserNumberPhoneSignIn: () => Promise<void>;
  onCreateNewUser: (data: any) => Promise<void>;
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
  const [userPhone, setUserPhone] = React.useState<any | null>(null);
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
      console.log("response", response);

      if (!response.token) {
        setUserPhone(response);
        let cek_phone_valid = validatePhoneNumber(response.phone);
        if (cek_phone_valid) {
          router.push("/(auth)/verification-otp");
          return;
        }
        router.push("/(auth)/setting-password");
        return;
      }
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

  const checkNumberPhoneUser = async (phone: string) => {
    try {
      if (!phone) {
        throw new Error("nomor ponsel tidak boleh kosong");
      }
      setIsLoading(true);
      const cek_user = await api.get(`/user?phone=${phone}`);
      const {
        data: { response },
      } = cek_user;
      setUserPhone({ ...response, phone });
      router.push("/(auth)/verification-otp");
    } catch (error: any) {
      console.log("error", error);

      console.log("error :", error.error);
      alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithNumberPhone = async (phone: string) => {
    try {
      const login_user = await api.post("/auth/login/phone", {
        phone: phone,
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
      alert(error?.message);
    }
  };
  const checkUserNumberPhoneSignIn = async () => {
    try {
      if (userPhone._id) {
        await signInWithNumberPhone(userPhone.phone);
        return;
      }
      router.push("/(auth)/setting-password");
    } catch (error: any) {
      alert(error?.message);
    }
  };
  const onCreateNewUser = async (data: any) => {
    try {
      setIsLoading(true);
      let body_req = {
        ...userPhone,
        ...data,
      };
      const req_user_pengguna = await api.post("/user/verification", body_req);
      const {
        data: { response },
      } = req_user_pengguna;
      const { source_id } = response;
      await api.get(`/syncdata/member-status?user_id=${source_id}`);
      await api.get(`/syncdata/member-payment?user_id=${source_id}`);
      await api.get(`/syncdata/weigh-measure?user_id=${source_id}`);
      await api.get(`/syncdata/workout?user_id=${source_id}`);
      await signInWithNumberPhone(body_req.phone);
      router.push("/(auth)");
    } catch (error: any) {
      console.log("error", error);
      console.log("error :", error.error);
      alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userPhone,
        setUserPhone,
        user,
        isLoading,
        signInWithUsernamePassword,
        signOut,
        checkNumberPhoneUser,
        checkUserNumberPhoneSignIn,
        onCreateNewUser,
      }}
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
