import Text from "@/components/ui/text";
import { AntDesign } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
import { NumberPhoneInput } from "@/components/ui/text-input";
import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const LoginPhoneScreen = () => {
  const { checkNumberPhoneUser } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = React.useState("");
  const checkNumberPhone = async () => {
    try {
      await checkNumberPhoneUser(phone);
    } catch (error: any) {
      console.log("error:", error?.message);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#6F3FA0] dark:bg-[#BB86FC]"
    >
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo */}

        <Text weight="bold" className=" text-3xl font-bold mb-2">
          Login ponsel
        </Text>

        <Text weight="semibold" className="text-center text-base">
          You've been missed,{"\n"}
          Please sign in your account
        </Text>

        {/* Illustration */}
        <Image
          source={require("@/assets/images/logo-curves.png")}
          className="w-60 h-60 mt-8"
          resizeMode="contain"
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="bg-[#F2F2F2] dark:bg-[#121212] rounded-t-[40px] px-6 pt-8 pb-12 mt-1 ">
          {/* Email */}

          <NumberPhoneInput
            label="Login Nomor Ponsel"
            placeholder="81234567890"
            value={phone}
            onChangeText={setPhone}
          />
          {/* Login Button */}
          <Pressable
            className="bg-[#5E2E91] dark:bg-[#9A67EA] py-4 rounded-xl items-center mb-6"
            onPress={checkNumberPhone}
          >
            <Text className="text-white font-semibold text-lg">Login</Text>
          </Pressable>

          {/* Register */}
          <TouchableOpacity
            className="items-center"
            onPress={() => router.push("/(auth)")}
          >
            <Text className="text-blue-600 font-medium">
              Login Username & Password ?
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-3 text-gray-400">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            // disabled={!request}
            // onPress={() => signIn()}
            className="flex-row items-center justify-center border border-[#6F3FA0] dark:border-[#BB86FC] py-4 rounded-xl mb-6"
          >
            <AntDesign name="google" size={20} color="#DB4437" />
            <Text className="ml-3 text-gray-700 font-medium text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      {/* ===== FORM CARD ===== */}
    </KeyboardAvoidingView>
  );
};

export default LoginPhoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
});
