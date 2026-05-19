import {
  NumberPhoneInput,
  PasswordInput,
  UsernameInput,
} from "@/components/ui/text-input";
import { useAuth } from "@/context/auth";
import { validatePhoneNumber } from "@/helpers";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const SettingPasswordScreen = () => {
  const { onCreateNewUser, setUserPhone, userPhone } = useAuth();
  const cek_phone_valid = validatePhoneNumber(userPhone.phone);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [verifPassword, setVerifPassword] = React.useState("");
  useEffect(() => {
    inputs.current[0]?.focus();
    setUsername(userPhone.username);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // pindah ke next
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isComplete = username && password && verifPassword ? true : false; //otp.every((digit) => digit !== "");

  const handleSubmit = async () => {
    const code = otp.join("");
    console.log("OTP:", code);
    if (!cek_phone_valid) {
      setUserPhone({
        ...userPhone,
        username,
        password,
        new_phone: phone,
        verify_password: verifPassword,
      });
      router.push("/(auth)/verification-otp");
    } else {
      await onCreateNewUser({
        username,
        password,
        verify_password: verifPassword,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#6F3FA0]"
    >
      {/* HEADER */}
      <View className="px-6 pt-20">
        <Text className="text-white text-2xl font-bold">Buat Password</Text>
        <Text className="text-purple-200 mt-2">Masukkan password baru</Text>
      </View>

      {/* FORM */}
      <View className="flex-1 bg-white rounded-t-[32px] mt-10 px-6 pt-8">
        {/* OTP INPUT */}
        {!cek_phone_valid && (
          <NumberPhoneInput
            label="Inputkan nomor ponsel"
            placeholder="81234567890"
            value={phone}
            onChangeText={setPhone}
          />
        )}
        <UsernameInput
          label="Buat Username"
          placeholder="inputkan username"
          value={username}
          onChangeText={setUsername}
        />
        <PasswordInput
          label="Password baru"
          placeholder="Inputkan password baru"
          value={password}
          onChangeText={setPassword}
        />
        <PasswordInput
          label="Verifikasi password baru"
          placeholder="Inputkan verifikasi password baru"
          value={verifPassword}
          onChangeText={setVerifPassword}
        />

        {/* BUTTON */}
        <Pressable
          disabled={!isComplete}
          onPress={handleSubmit}
          className={`py-4 rounded-2xl items-center ${
            isComplete ? "bg-[#5E2E91]" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-semibold text-lg">Simpan</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SettingPasswordScreen;
