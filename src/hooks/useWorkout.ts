import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLastWorkout = () => {
  return useQuery({
    queryKey: ["last-workout"],
    queryFn: async () => {
      const {
        data: { response },
      } = await api.get("/user/last-workout");
      return response;
    },
  });
};

export const useWorkoutHistory = () => {
  return useMutation({
    mutationFn: async ({ year, month }: any) => {
      const { data } = await api.get(
        `/user/workout?year=${year}&month=${month}`,
      );
      return data;
    },
  });
};
