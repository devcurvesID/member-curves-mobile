import ContainerPage from "@/components/ui/container-page";
import { formatCurrency } from "@/helpers/dates";
import { useMemberPayment } from "@/hooks/usePayments";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

const payment = {
  member_name: "ini hanya test",
  membership_type: "PP12 - 2026",
  payment_number: "00230906/PY/CIND/001/V/2026",
  payment_date: "15-05-2026 14:02",
  cashier: "DEV IT",

  service_fee: 3000000,
  monthly_fee: 7380000,
  discount: 3000000,

  total: 7380000,
  paid_amount: 5000000,
  remaining_bill: 2380000,

  payment_method: "Tunai",
  bank_name: "DEFAULT",
};
export default function DetailBillScreen() {
  const router = useRouter();
  const {
    data: memberPayment,
    isLoading: isLoadingMemberPayment,
    //   error,
    //   refetch,
  } = useMemberPayment();
  console.log("memberPayment", memberPayment);

  const onSubmit = (data: any) => {
    console.log("SUBMIT:", data);
    // 🔥 call API di sini
  };

  if (isLoadingMemberPayment) {
    return (
      <View className="flax-1 items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <ContainerPage
      titleHeader="Detail Tagihan"
      titleContent="Lihat detail tagihan"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 5,
          paddingBottom: 120,
        }}
      >
        {/* RECEIPT CARD */}
        <View className="bg-white rounded-[32px] p-6 shadow-sm">
          {/* LOGO */}
          <View className="items-center">
            <Image
              source={require("@/assets/images/curves.jpg")}
              resizeMode="contain"
              className="w-36 h-20"
            />

            <Text className="text-xl font-bold text-gray-800 mt-2">
              Curves Surya Sumantri
            </Text>
          </View>

          {/* MEMBER INFO */}
          <View className="mt-10 gap-6">
            {/* Membership */}
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={18}
                  color="#9CA3AF"
                />

                <Text className="text-gray-400 text-base ml-2">
                  Tipe Keanggotaan
                </Text>
              </View>

              <Text className="font-semibold text-base text-gray-800">
                {payment.membership_type}
              </Text>
            </View>

            {/* Member Name */}
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={18} color="#9CA3AF" />

                <Text className="text-gray-400 text-base ml-2">
                  Terima Dari
                </Text>
              </View>

              <Text className="font-semibold text-base text-gray-800 flex-1 text-right ml-4">
                {payment.member_name}
              </Text>
            </View>

            {/* Invoice */}
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={18}
                  color="#9CA3AF"
                />

                <Text className="text-gray-400 text-base ml-2">No Invoice</Text>
              </View>

              <Text className="font-semibold text-base text-gray-800 flex-1 text-right ml-4">
                {payment.payment_number}
              </Text>
            </View>

            {/* Date */}
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />

                <Text className="text-gray-400 text-base ml-2">Tanggal</Text>
              </View>

              <Text className="font-semibold text-base text-gray-800">
                {payment.payment_date}
              </Text>
            </View>

            {/* Cashier */}
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <Ionicons
                  name="person-circle-outline"
                  size={18}
                  color="#9CA3AF"
                />

                <Text className="text-gray-400 text-base ml-2">Kasir</Text>
              </View>

              <Text className="font-semibold text-base text-gray-800">
                {payment.cashier}
              </Text>
            </View>
          </View>

          {/* DIVIDER */}
          <View className="border-t border-dashed border-gray-300 my-8" />

          {/* PAYMENT DETAIL */}
          <View className="gap-5">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-base">Biaya Layanan</Text>

              <Text className="font-semibold text-base text-gray-800">
                {formatCurrency(payment.service_fee)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-base">Biaya Bulanan</Text>

              <Text className="font-semibold text-base text-gray-800">
                {formatCurrency(payment.monthly_fee)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-base">Diskon</Text>

              <Text className="font-semibold text-base text-red-500">
                - {formatCurrency(payment.discount)}
              </Text>
            </View>
          </View>

          {/* DIVIDER */}
          <View className="border-t border-dashed border-gray-300 my-8" />

          {/* TOTAL */}
          <View className="gap-5">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <FontAwesome5
                  name="money-bill-wave"
                  size={16}
                  color="#6F3FA0"
                />

                <Text className="text-lg font-bold text-gray-800 ml-2">
                  Total
                </Text>
              </View>

              <Text className="text-2xl font-bold text-[#6F3FA0]">
                {formatCurrency(payment.total)}
              </Text>
            </View>

            {/* PAYMENT METHOD */}
            <View className="bg-[#F8F5FF] rounded-2xl p-5">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="wallet-outline" size={18} color="#6F3FA0" />

                  <Text className="ml-2 text-gray-700 font-medium">
                    {payment.payment_method} {payment.bank_name}
                  </Text>
                </View>

                <Text className="font-bold text-[#6F3FA0]">
                  {formatCurrency(payment.paid_amount)}
                </Text>
              </View>
            </View>

            {/* REMAINING */}
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-gray-500">Sisa Hutang</Text>

              <Text className="text-xl font-bold text-red-500">
                {formatCurrency(payment.remaining_bill)}
              </Text>
            </View>
          </View>

          {/* DIVIDER */}
          <View className="border-t border-dashed border-gray-300 my-8" />

          {/* FOOTER */}
          <View className="items-center">
            <Text className="text-gray-500 text-sm">Sudah termasuk pajak</Text>

            <Text className="text-3xl font-bold text-[#6F3FA0] mt-10">
              Terima Kasih
            </Text>

            <Text className="text-gray-400 text-sm mt-2 text-center">
              Keep crushing your workout 💪
            </Text>
          </View>
        </View>
      </ScrollView>
    </ContainerPage>
  );
}
