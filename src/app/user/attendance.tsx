import { BottomSheetRefProps } from "@/components/ui/bottom-sheet";
import ContainerPage from "@/components/ui/container-page";
import DateMonthPicker from "@/components/ui/date-month-picker";
import { FlatListItem } from "@/components/ui/flat-list-item";
import MenuItem from "@/components/ui/menu-item";
import { useAuth } from "@/context/auth";
import { getDateTime } from "@/helpers/dates";
import { useLastWorkout, useWorkoutHistory } from "@/hooks/useWorkout";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AttendanceScreen() {
  const { user, signOut } = useAuth();

  const { data: lastWorkout, error, isLoading, refetch } = useLastWorkout();
  console.log("lastWorkout", lastWorkout);

  const {
    mutate: workoutHistoryFn,
    data: workoutHistory,
    isPending,
  } = useWorkoutHistory();
  console.log("isPending", isPending);

  const user_personal = user.user_personal;
  const curr_workout_date = user_personal.joined;
  const joined_year = new Date(curr_workout_date).getFullYear();

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
  React.useEffect(() => {
    async function getWorkout() {
      let joined_year = new Date(lastWorkout.workout_date).getFullYear();
      let joined_month = new Date(lastWorkout.workout_date).getMonth();
      await workoutHistoryFn({ year: joined_year, month: joined_month });
    }
    getWorkout();
  }, [lastWorkout]);
  console.log("fes", workoutHistory);

  const onPress = React.useCallback(() => {
    const isActive = ref?.current?.isActive();

    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-300);
    }
  }, []);
  // 🔥 generate tahun

  // 🔥 sync bulan kalau tahun berubah

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

    await workoutHistoryFn({ year: data.year, month: data.month });
    onOpenPicker();
  };

  return (
    <>
      <ContainerPage titleHeader="Workout" titleContent={user.name}>
        <MenuItem
          icon="calendar-outline"
          title={`${selectDateMonth.month_value} - ${selectDateMonth.year}`}
          isBottom
          onPress={onPress}
        />
        {!isPending && workoutHistory && (
          <View className=" mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-400 text-xs">Summary</Text>

            <View className="flex-row justify-between mt-3">
              <View>
                <Text className="text-gray-400 text-xs">Workout Bulan Ini</Text>
                <Text className="text-xl font-bold text-purple-600">
                  {workoutHistory.total_workout_per_month}
                </Text>
              </View>

              <View>
                <Text className="text-gray-400 text-xs">Total Workout</Text>
                <Text className="text-xl font-bold text-purple-600">
                  {workoutHistory.total}
                </Text>
              </View>
            </View>
          </View>
        )}

        {workoutHistory && (
          <FlatListItem
            data={workoutHistory.response}
            keyExtractor={(item: any, index) =>
              item._id ? `${item._id}-${index}` : index.toString()
            }
            CustomComponent={DataWorkoutHistoryView}
            ListFooterComponent={() =>
              isPending ? <ActivityIndicator /> : null
            }
          />
        )}
        {/* <ScrollView
          contentContainerClassName="px-2 pt-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
         
        </ScrollView> */}
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

const DataWorkoutHistoryView = React.memo(({ data }: any) => {
  return (
    <View className="mt-4" key={data._id.toString()}>
      <Text className="text-gray-500 text-xs mb-2">
        {getDateTime(data.workout_date)}
      </Text>

      <View className="bg-white rounded-xl p-3">
        <View className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-0">
          <View>
            <Text className="text-sm font-semibold text-gray-800">Bandung</Text>
            <Text className="text-xs text-gray-400">
              {new Date(data.workout_date).toLocaleTimeString()}{" "}
            </Text>
          </View>

          <View className="bg-purple-100 px-3 py-1 rounded-full">
            <Text className="text-xs text-purple-600">Workout</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
