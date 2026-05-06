import ContainerPage from "@/components/ui/container-page";
import Item from "@/components/ui/item";
import Section from "@/components/ui/section";
import { useAuth } from "@/context/auth";
import { formatDate } from "@/helpers/dates";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const user_personal = user.user_personal;
  return (
    <ContainerPage
      titleHeader="Detail Profil"
      titleContent="Informasi pengguna"
    >
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
        contentContainerClassName="px-2 pt-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT */}
        <Section title="Account Info">
          <Item label="Nama" value={user.name} iconKey="name" />
          <Item label="Email" value={user.email} iconKey="email" />
          <Item
            label="Tanggal Daftar"
            value={formatDate(user.created_at)}
            iconKey="joined"
          />
        </Section>

        {/* PERSONAL */}
        <Section title="Personal Info">
          <Item
            label="Tanggal Lahir"
            value={formatDate(user_personal.birth)}
            iconKey="birth"
          />
          <Item
            label="Jenis Kelamin"
            value={user_personal.sex === "F" ? "Perempuan" : "Laki-laki"}
            iconKey="sex"
          />
          <Item
            label="Ukuran Kaos"
            value={`Size ${user_personal.tshirt_size}`}
            iconKey="tshirt"
          />
        </Section>

        {/* CONTACT */}
        <Section title="Contact">
          <Item label="Phone" value={user_personal.phone} iconKey="phone" />
          <Item
            label="Cellphone"
            value={user_personal.cellphone}
            iconKey="phone"
          />
          <Item
            label="Alamat"
            value={user_personal.address}
            iconKey="address"
          />
        </Section>

        <Pressable
          className="bg-[#5E2E91] dark:bg-[#9A67EA] py-4 rounded-xl items-center mb-6"
          onPress={() => router.push("/user/edit-profile")}
        >
          <Text className="text-white font-semibold text-lg">Edit Profil</Text>
        </Pressable>

        <View className="h-10" />
      </ScrollView>
    </ContainerPage>
  );
}
