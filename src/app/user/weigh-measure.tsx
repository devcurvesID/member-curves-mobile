import { BottomSheetRefProps } from "@/components/ui/bottom-sheet";
import ContainerPage from "@/components/ui/container-page";
import DateMonthPicker from "@/components/ui/date-month-picker";
import MenuItem from "@/components/ui/menu-item";
import Section from "@/components/ui/section";
import { useAuth } from "@/context/auth";
import {
  useLastWeighMeasure,
  useWeighMeasureHistory,
} from "@/hooks/useWeighMeasure";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const getIcon = (key: string) => {
  switch (key) {
    case "age":
      return <Ionicons name="person-outline" size={18} color="#6366F1" />;
    case "height":
      return (
        <MaterialCommunityIcons
          name="human-male-height"
          size={18}
          color="#6366F1"
        />
      );
    case "weight":
      return (
        <MaterialCommunityIcons
          name="scale-bathroom"
          size={18}
          color="#8B5CF6"
        />
      );

    case "bmi":
      return (
        <MaterialCommunityIcons name="chart-line" size={18} color="#F59E0B" />
      );
    case "body_fat":
      return (
        <MaterialCommunityIcons
          name="water-percent"
          size={18}
          color="#EF4444"
        />
      );
    case "muscle_mass":
      return (
        <MaterialCommunityIcons name="arm-flex" size={18} color="#10B981" />
      );
    case "bone_mass":
      return <MaterialCommunityIcons name="bone" size={18} color="#6B7280" />;
    case "body_water":
      return <MaterialCommunityIcons name="water" size={18} color="#3B82F6" />;
    case "visceral":
      return (
        <MaterialCommunityIcons name="heart-pulse" size={18} color="#EF4444" />
      );

    case "bp":
      return (
        <MaterialCommunityIcons name="heart-pulse" size={18} color="#DC2626" />
      );
    case "rhr":
      return <MaterialCommunityIcons name="heart" size={18} color="#F43F5E" />;

    case "chest":
      return (
        <MaterialCommunityIcons name="human-male" size={18} color="#6366F1" />
      );
    case "waist":
      return (
        <MaterialCommunityIcons name="tape-measure" size={18} color="#8B5CF6" />
      );
    case "abdomen":
      return (
        <MaterialCommunityIcons name="stomach" size={18} color="#F97316" />
      );
    case "hip":
      return (
        <MaterialCommunityIcons name="human-female" size={18} color="#EC4899" />
      );
    case "thigh":
      return <MaterialCommunityIcons name="run" size={18} color="#22C55E" />;
    case "arm":
      return (
        <MaterialCommunityIcons
          name="arm-flex-outline"
          size={18}
          color="#10B981"
        />
      );

    default:
      return (
        <Ionicons name="information-circle-outline" size={18} color="#999" />
      );
  }
};

const Item = ({
  label,
  value,
  iconKey,
}: {
  label: string;
  value: any;
  iconKey: string;
}) => (
  <View className="mb-3">
    <Text className="text-gray-400 text-xs mb-1">{label}</Text>

    <View className="flex-row items-center border border-purple-400 rounded-xl px-4 py-3 bg-white">
      {getIcon(iconKey)}
      <Text className="ml-3 text-gray-800 font-semibold">{value ?? "-"}</Text>
    </View>
  </View>
);

// const Section = ({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <View className="mb-6">
//     <Text className="text-gray-700 font-bold mb-3">{title}</Text>

//     <View className="bg-white rounded-2xl p-4 shadow-sm">{children}</View>
//   </View>
// );

export default function WeighMeasureScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const {
    data: weighMeasure,
    error,
    isLoading,
    refetch,
  } = useLastWeighMeasure();
  const {
    mutate: weighMeasureHistoryFn,
    data: weighMeasureHistory,
    isPending,
  } = useWeighMeasureHistory();

  const ref = React.useRef<BottomSheetRefProps>(null);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [selectDateMonth, setSelectDateMonth] = React.useState<any>({
    year: currentYear,
    month: currentMonth,
    month_value: new Date(0, currentMonth - 1).toLocaleString("id-ID", {
      month: "long",
    }),
  });
  const user_personal = user.user_personal;
  const curr_workout_date = user_personal.joined;
  const joined_year = new Date(curr_workout_date).getFullYear();

  React.useEffect(() => {
    async function getWorkout() {
      let joined_year = new Date(weighMeasure.wm_date).getFullYear();
      let joined_month = new Date(weighMeasure.wm_date).getMonth();
      await weighMeasureHistoryFn({ year: joined_year, month: joined_month });
    }
    getWorkout();
  }, [weighMeasure]);

  if (isLoading) {
    return (
      <View className="flax-1 items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const onOpenPicker = React.useCallback(() => {
    const isActive = ref?.current?.isActive();

    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-300);
    }
  }, []);
  const onSelectPicker = async (data: any) => {
    setSelectDateMonth(data);
    await weighMeasureHistoryFn({ year: data.year, month: data.month });
    onOpenPicker();
  };

  return (
    <>
      <ContainerPage titleHeader="Weigh Measure" titleContent={user.name}>
        <ScrollView
          contentContainerClassName="px-2 pt-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <MenuItem
            icon="calendar-outline"
            title={`${selectDateMonth.month_value} - ${selectDateMonth.year}`}
            isBottom
            onPress={onOpenPicker}
          />

          {!isPending && weighMeasureHistory ? (
            <>
              {weighMeasureHistory.response.length > 0 ? (
                weighMeasureHistory.response.map((item: any, idx: any) => {
                  return (
                    <View key={idx.toString()}>
                      {/* BASIC */}
                      <Section title="Basic Info">
                        <Item
                          label="Umur"
                          value={`${item.age} tahun`}
                          iconKey="age"
                        />
                        <Item
                          label="Tinggi"
                          value={`${item.height} cm`}
                          iconKey="height"
                        />
                        <Item
                          label="Berat"
                          value={`${item.weight} kg`}
                          iconKey="weight"
                        />
                      </Section>

                      {/* BODY COMPOSITION */}
                      <Section title="Body Composition">
                        <Item label="BMI" value={item.bmi} iconKey="bmi" />
                        <Item
                          label="Body Fat"
                          value={`${item.body_fat} %`}
                          iconKey="body_fat"
                        />
                        <Item
                          label="Muscle Mass"
                          value={`${item.muscle_mass} kg`}
                          iconKey="muscle_mass"
                        />
                        <Item
                          label="Bone Mass"
                          value={`${item.bone_mass} kg`}
                          iconKey="bone_mass"
                        />
                        <Item
                          label="Body Water"
                          value={`${item.body_water} %`}
                          iconKey="body_water"
                        />
                        <Item
                          label="Visceral Fat"
                          value={item.visceral}
                          iconKey="visceral"
                        />
                      </Section>

                      {/* VITAL SIGNS */}
                      <Section title="Vital Signs">
                        <Item
                          label="Blood Pressure"
                          value={`${item.bp_high}/${item.bp_low}`}
                          iconKey="bp"
                        />
                        <Item
                          label="Resting Heart Rate"
                          value={`${item.rhr} bpm`}
                          iconKey="rhr"
                        />
                      </Section>

                      {/* BODY SIZE */}
                      <Section title="Body Measurement">
                        <Item
                          label="Chest"
                          value={`${item.chest} cm`}
                          iconKey="chest"
                        />
                        <Item
                          label="Waist"
                          value={`${item.waist} cm`}
                          iconKey="waist"
                        />
                        <Item
                          label="Abdomen"
                          value={`${item.abdomen} cm`}
                          iconKey="abdomen"
                        />
                        <Item
                          label="Hip"
                          value={`${item.hip} cm`}
                          iconKey="hip"
                        />
                        <Item
                          label="Thigh"
                          value={`${item.thigh} cm`}
                          iconKey="thigh"
                        />
                        <Item
                          label="Arm"
                          value={`${item.arm} cm`}
                          iconKey="arm"
                        />
                      </Section>
                    </View>
                  );
                })
              ) : (
                <Text className="text-gray-700 font-bold mb-3 text-center">
                  Tidak ada penimbangan berat badan
                </Text>
              )}
            </>
          ) : (
            <Text className="text-gray-700 font-bold mb-3 text-center">
              Tidak ada penimbangan berat badan
            </Text>
          )}
        </ScrollView>
      </ContainerPage>
      <DateMonthPicker
        ref={ref}
        onSelect={onSelectPicker}
        joined_year={joined_year}
        onCancel={onOpenPicker}
      />
    </>
  );
}
