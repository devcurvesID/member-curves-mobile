import { useAuth } from "@/context/auth";
import { COLORS } from "@/themes/colors";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

const TabsLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // if (!isLoaded) return null;
  if (!user) return <Redirect href={"/(auth)"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 32,
          borderTopWidth: 0,
          marginHorizontal: 5,
          // shadow
          shadowColor: "#000",
          shadowOpacity: 0.45,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 18,
          // borderTopColor: "#1A1A1D",
          // borderTopWidth: 1,
          // height: 88,
          // paddingTop: 8,
        },
        tabBarShowLabel: true,

        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: "#ffffff",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="comunity"
        options={{
          title: "Comunity",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
