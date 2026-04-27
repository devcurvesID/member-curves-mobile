import Container from "@/components/ui/container";
import ListItem from "@/components/ui/list-item";
import Text from "@/components/ui/text";
import { useAuth } from "@/context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, View } from "react-native";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-[#6F3FA0] dark:bg-[#BB86FC] border border-white/10 rounded-2xl p-4 items-center">
      <Text className="text-[#ffffff] text-xl font-bold">{value}</Text>
      <Text className="text-[#F5F5F5] text-xs mt-1">{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const user_personal = user.user_personal;
  return (
    <Container onDetail titleHeader="Detail Profile">
      <View className="items-center">
        <LinearGradient
          colors={["#6F3FA0", "#BB86FC"]}
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            //   "https://i.pravatar.cc/300"
            source={{
              uri: user_personal.photo
                ? user_personal.photo
                : "https://i.pravatar.cc/300",
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
        </LinearGradient>
      </View>
      <ScrollView
        contentContainerClassName="px-6 pt-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ListItem label="Nama Lengkap" value={user.name} />
        <ListItem label="NIK" value={user_personal.nik} />
        <ListItem label="Alamat" value={user_personal.address} />
        <ListItem label="Nomor Ponsel" value={user_personal.phone} />

        <ListItem label="Tanggal Lahir" value={user_personal.birth} />
        <ListItem label="Tanggal Join" value={user_personal.joined} />
        <ListItem label="Ukuran Tshirt" value={user_personal.tshirt_size} />
      </ScrollView>
    </Container>
  );
}
