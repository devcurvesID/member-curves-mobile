import { BottomSheetRefProps } from "@/components/ui/bottom-sheet";
import ContainerPage from "@/components/ui/container-page";
import DateMonthPicker from "@/components/ui/date-month-picker";
import { FlatListItem } from "@/components/ui/flat-list-item";
import Item from "@/components/ui/item";
import MenuItem from "@/components/ui/menu-item";
import Section from "@/components/ui/section";
import { useAuth } from "@/context/auth";
import {
  useLastWeighMeasure,
  useWeighMeasureHistory,
} from "@/hooks/useWeighMeasure";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

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
        <MenuItem
          icon="calendar-outline"
          title={`${selectDateMonth.month_value} - ${selectDateMonth.year}`}
          isBottom
          onPress={onOpenPicker}
        />

        {weighMeasureHistory && (
          <FlatListItem
            data={weighMeasureHistory.response}
            keyExtractor={(item: any, index) =>
              item._id ? `${item._id}-${index}` : index.toString()
            }
            CustomComponent={DataWeighMeasureHistoryView}
            ListFooterComponent={() =>
              isPending ? <ActivityIndicator /> : null
            }
          />
        )}
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

const DataWeighMeasureHistoryView = React.memo(({ data }: any) => {
  return (
    <View key={data._id.toString()}>
      {/* BASIC */}
      <Section title="Basic Info">
        <Item label="Umur" value={`${data.age} tahun`} iconKey="age" />
        <Item label="Tinggi" value={`${data.height} cm`} iconKey="height" />
        <Item label="Berat" value={`${data.weight} kg`} iconKey="weight" />
      </Section>

      {/* BODY COMPOSITION */}
      <Section title="Body Composition">
        <Item label="BMI" value={data.bmi} iconKey="bmi" />
        <Item
          label="Body Fat"
          value={`${data.body_fat} %`}
          iconKey="body_fat"
        />
        <Item
          label="Muscle Mass"
          value={`${data.muscle_mass} kg`}
          iconKey="muscle_mass"
        />
        <Item
          label="Bone Mass"
          value={`${data.bone_mass} kg`}
          iconKey="bone_mass"
        />
        <Item
          label="Body Water"
          value={`${data.body_water} %`}
          iconKey="body_water"
        />
        <Item label="Visceral Fat" value={data.visceral} iconKey="visceral" />
      </Section>

      {/* VITAL SIGNS */}
      <Section title="Vital Signs">
        <Item
          label="Blood Pressure"
          value={`${data.bp_high}/${data.bp_low}`}
          iconKey="bp"
        />
        <Item
          label="Resting Heart Rate"
          value={`${data.rhr} bpm`}
          iconKey="rhr"
        />
      </Section>

      {/* BODY SIZE */}
      <Section title="Body Measurement">
        <Item label="Chest" value={`${data.chest} cm`} iconKey="chest" />
        <Item label="Waist" value={`${data.waist} cm`} iconKey="waist" />
        <Item label="Abdomen" value={`${data.abdomen} cm`} iconKey="abdomen" />
        <Item label="Hip" value={`${data.hip} cm`} iconKey="hip" />
        <Item label="Thigh" value={`${data.thigh} cm`} iconKey="thigh" />
        <Item label="Arm" value={`${data.arm} cm`} iconKey="arm" />
      </Section>
    </View>
  );
});
