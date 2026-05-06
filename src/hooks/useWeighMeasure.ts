import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLastWeighMeasure = () => {
  return useQuery({
    queryKey: ["last-weigh-measure"],
    queryFn: async () => {
      const {
        data: { response },
      } = await api.get("/user/last-weigh-measure");
      return response;
    },
  });
};

export const useWeighMeasureHistory = () => {
  return useMutation({
    mutationFn: async ({ year, month }: any) => {
      const { data } = await api.get(
        `/user/weigh-measure?year=${year}&month=${month}`,
      );
      return data;
    },
  });
};
