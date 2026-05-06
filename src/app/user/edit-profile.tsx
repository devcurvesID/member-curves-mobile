import ContainerPage from "@/components/ui/container-page";
import FormInput from "@/components/ui/form-input";
import Section from "@/components/ui/section";
import { useAuth } from "@/context/auth";
import { useLastWeighMeasure } from "@/hooks/useWeighMeasure";
import { userSchema } from "@/schemas/userSchema";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const user_personal = user.user_personal;
  console.log("user_personal", user_personal);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: `${String(user_personal.phone)}`,
      address: user_personal.address,
      tshirt_size: `${String(user_personal.tshirt_size)}`,
    },
  });

  const onSubmit = (data: any) => {
    console.log("SUBMIT:", data);
    // 🔥 call API di sini
  };

  const {
    data: weighMeasure,
    error,
    isLoading,
    refetch,
  } = useLastWeighMeasure();
  console.log("weighMeasure", weighMeasure);

  if (isLoading) {
    return (
      <View className="flax-1 items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <ContainerPage
      titleHeader="Edit Profil"
      titleContent="Edit Profil Pengguna"
    >
      <ScrollView
        contentContainerClassName="px-2 pt-5 pb-32"
        showsVerticalScrollIndicator={false}
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
        {/* ACCOUNT */}
        <Section title="Account Info">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Nama"
                value={value}
                onChangeText={onChange}
                icon={<Ionicons name="person" size={18} color="#6366F1" />}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Email"
                value={value}
                onChangeText={onChange}
                icon={<Ionicons name="mail" size={18} color="#3B82F6" />}
                error={errors.email?.message}
              />
            )}
          />
        </Section>

        {/* PERSONAL */}
        <Section title="Personal Info">
          <Controller
            control={control}
            name="tshirt_size"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Ukuran Kaos"
                value={value}
                onChangeText={onChange}
                icon={
                  <MaterialCommunityIcons
                    name="tshirt-crew"
                    size={18}
                    color="#8B5CF6"
                  />
                }
                error={errors.tshirt_size?.message}
              />
            )}
          />
        </Section>

        {/* CONTACT */}
        <Section title="Contact">
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Phone"
                value={value}
                onChangeText={onChange}
                icon={<Ionicons name="call" size={18} color="#22C55E" />}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Alamat"
                value={value}
                onChangeText={onChange}
                icon={<Ionicons name="location" size={18} color="#F97316" />}
                error={errors.address?.message}
              />
            )}
          />
        </Section>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-purple-700 py-4 rounded-xl mt-4"
        >
          <Text className="text-white text-center font-bold">
            Simpan Perubahan
          </Text>
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </ContainerPage>
  );
}
