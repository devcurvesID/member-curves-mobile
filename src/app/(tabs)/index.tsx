import MenuTile from "@/components/ui/menu-tile";
import Text from "@/components/ui/text";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
const DashboardScreen = () => {
  const { colorScheme } = useColorScheme(); // "light" | "dark"
  console.log("colorScheme", colorScheme);
  const { user, isLoading } = useAuth();

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
              Hi, {user.name}
            </Text>
            <Text
              variant="subtitle"
              weight="medium"
              className="text-[#FFFFFF] dark:text-[#FFFFFF] text-base mt-2"
            >
              Ready to crush your workout? 💪
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
          <View className="flex-row gap-4">
            <MenuTile
              onPress={() => router.push("/user/weigh-measure")}
              title="Penimbangan & Pengukuran"
              icon={<Ionicons name="calendar" size={22} color="#F8BBD0" />}
            />
            <MenuTile
              title="Tagihan"
              icon={<Ionicons name="bar-chart" size={22} color="#F8BBD0" />}
            />
          </View>
          <View className="flex-row gap-4 mt-4">
            <MenuTile
              title="Laporan"
              icon={<Ionicons name="bar-chart" size={22} color="#F8BBD0" />}
            />
            <MenuTile
              onPress={() => router.push("/user/attendance")}
              title="Absensi"
              icon={<Ionicons name="bar-chart" size={22} color="#F8BBD0" />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
