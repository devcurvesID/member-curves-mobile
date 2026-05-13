import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useUserClub = () => {
  return useQuery({
    queryKey: ["club"],
    queryFn: async () => {
      const {
        data: { response },
      } = await api.get("/user/club");
      return response;
    },
  });
};
