import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useMemberPayment = () => {
  return useQuery({
    queryKey: ["member-payment"],
    queryFn: async () => {
      const {
        data: { response },
      } = await api.get("/user/member-payment");
      return response;
    },
  });
};
