import Text from "@/components/ui/text";
import { DataWorkoutHistoryView } from "@/components/workout/list-workout";
import { useAuth } from "@/context/auth";
import { useLastWorkout } from "@/hooks/useWorkout";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <View className="mt-6 mb-3">
      <Text variant="title" weight="bold" className="text-xl font-semibold">
        {children}
      </Text>
    </View>
  );
}
function Divider() {
  return <View className="h-[1px] bg-white/10 my-5" />;
}
const WorkOutScreen = () => {
  const {
    data: lastWorkout,
    error,
    isLoading: isLoadingLastWorkout,
    refetch,
  } = useLastWorkout();

  const { colorScheme } = useColorScheme(); // "light" | "dark"
  console.log("colorScheme", colorScheme);
  const { user, isLoading } = useAuth();
  console.log("user", user);

  let base64Logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..";

  const colors = React.useMemo<[string, string]>(() => {
    if (colorScheme == "dark") {
      return ["#6F3FA0", "#BB86FC"];
    }
    return ["#BB86FC", "#6F3FA0"];
  }, [colorScheme]);
  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF] dark:bg-[#121212]">
      <ImageBackground
        source={require("@/assets/images/bg-curves-light.png")}
        resizeMode="cover"
        className="absolute inset-0"
      />
      <View
        pointerEvents="none"
        className="absolute -top-24 left-0 right-0 h-[320px] rounded-b-[60px] overflow-hidden"
        // className="absolute -top-24 left-0 right-0 h-96 rounded-b-[60px] overflow-hidden"
        style={{
          backgroundColor: "transparent",
          shadowColor: "#000",
        }}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0.1, y: 0.0 }}
          end={{ x: 0.9, y: 1.0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-8 pb-40"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View>
            <Text
              variant="title"
              weight="bold"
              className="text-[#FFFFFF] dark:text-[#FFFFFF] text-4xl font-extrabold tracking-tight"
            >
              Member QR
            </Text>
            <Text
              variant="subtitle"
              weight="medium"
              className="text-[#FFFFFF] dark:text-[#FFFFFF] text-base mt-2"
            >
              Scan untuk check-in workout 💪
            </Text>
          </View>

          <Pressable className="mt-2">
            <View className="w-14 h-14 rounded-full bg-white/5 border border-white/10 items-center justify-center">
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#F8BBD0"
              />
              {/* dot */}
              <View className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#B7F10A]" />
            </View>
          </Pressable>
        </View>
        {/* <Divider /> */}

        <View className="pt-28">
          {/* <SectionTitle>Your Weekly Progress</SectionTitle> */}

          {/* QR CONTAINER */}
          <View className="items-center justify-center">
            <View className="bg-white p-5 rounded-[28px] shadow-2xl shadow-purple-500/40">
              {/* QR CODE */}
              <QRCode
                // value={`${user._id}-${user.source_id}`}
                value={user.user_personal.key_tag_id}
                logo={require("@/assets/images/logo-curves.png")}
                logoSize={40}
                logoBackgroundColor="#F2F2F2"
                color="#BB86FC"
                size={300}
              />
            </View>

            {/* MEMBER INFO */}
            <View className="items-center mt-5">
              <Text className="text-white text-lg font-bold">{user.name}</Text>

              <Text className="text-white/70 text-sm mt-1">
                MEMBER ID • {user.user_personal.key_tag_id}
              </Text>
            </View>
          </View>
        </View>
        {!isLoadingLastWorkout && lastWorkout && (
          <DataWorkoutHistoryView data={lastWorkout} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkOutScreen;
