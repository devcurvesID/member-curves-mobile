import BottomSheetComponent, {
  BottomSheetRefProps,
} from "@/components/ui/bottom-sheet";
import ContainerPage from "@/components/ui/container-page";
import MenuItem from "@/components/ui/menu-item";
import WheelPicker from "@/components/ui/wheel-picker";
import { useAuth } from "@/context/auth";
import { getDateTime } from "@/helpers/dates";
import { useLastWorkout, useWorkoutHistory } from "@/hooks/useWorkout";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  const [tempYear, setTempYear] = React.useState(currentYear);
  const [tempMonth, setTempMonth] = React.useState(currentMonth);
  const [labelMonth, setLabelMonth] = React.useState<string>(
    new Date(0, currentMonth - 1).toLocaleString("id-ID", {
      month: "long",
    }),
  );

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
  const years = React.useMemo(() => {
    const arr = [];
    for (let y = currentYear; y >= joined_year; y--) {
      // arr.push({ label: `${y}`, value: y });
      arr.push(y);
    }
    return arr;
  }, []);

  // 🔥 generate bulan (dinamis)
  const months = React.useMemo(() => {
    const maxMonth = tempYear === currentYear ? currentMonth : 12;

    const arr = [];
    for (let m = 1; m <= maxMonth; m++) {
      arr.push({
        label: new Date(0, m - 1).toLocaleString("id-ID", {
          month: "long",
        }),
        value: m,
      });
    }
    return arr;
  }, [tempYear]);

  // 🔥 sync bulan kalau tahun berubah
  if (tempYear === currentYear && tempMonth > currentMonth) {
    setTempMonth(currentMonth);
  }

  const onSelectDate = async () => {
    console.log("sss", tempYear, tempMonth);

    await workoutHistoryFn({ year: tempYear, month: tempMonth - 1 });
    onPress();
  };

  return (
    <>
      <ContainerPage
        titleHeader="Absensi"
        titleContent="Riwayat absensi member"
      >
        <ScrollView
          contentContainerClassName="px-2 pt-5 pb-32"
          showsVerticalScrollIndicator={false}
        >
          <MenuItem
            icon="calendar-outline"
            title={`${labelMonth} - ${tempYear}`}
            isBottom
            onPress={onPress}
          />
          {!isPending && workoutHistory && (
            <View className=" mt-4 bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-gray-400 text-xs">Summary</Text>

              <View className="flex-row justify-between mt-3">
                <View>
                  <Text className="text-gray-400 text-xs">
                    Workout Bulan Ini
                  </Text>
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

          {!isPending &&
            workoutHistory &&
            workoutHistory.response.map((item: any, idx: any) => {
              return (
                <View className="mt-4" key={idx}>
                  <Text className="text-gray-500 text-xs mb-2">
                    {getDateTime(item.workout_date)}
                  </Text>

                  <View className="bg-white rounded-xl p-3">
                    <View className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <View>
                        <Text className="text-sm font-semibold text-gray-800">
                          Bandung
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {new Date(
                            item.workout_date,
                          ).toLocaleTimeString()}{" "}
                        </Text>
                      </View>

                      <View className="bg-purple-100 px-3 py-1 rounded-full">
                        <Text className="text-xs text-purple-600">Workout</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </ContainerPage>
      <BottomSheetComponent ref={ref}>
        <View className="flex-1 p-4 bg-white">
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={onPress}>
              <Text className="text-red-500">Batal</Text>
            </TouchableOpacity>

            <Text className="font-bold text-lg">Pilih Tanggal</Text>

            <TouchableOpacity onPress={onSelectDate}>
              <Text className="text-purple-600 font-semibold">Pilih</Text>
            </TouchableOpacity>
          </View>
          {/* PICKER */}
          <View className="flex-row justify-between">
            <View className="flex-1">
              <WheelPicker
                data={years}
                value={currentYear}
                onChange={(val) => setTempYear(val)}
                renderLabel={(item) => item.toString()}
              />
            </View>
            <View className="flex-1">
              <WheelPicker
                data={months}
                value={months[currentMonth]}
                onChange={(val) => {
                  setTempMonth(val.value);
                  setLabelMonth(val.label);
                }}
                renderLabel={(item) => item.label}
              />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    </>
  );
}
