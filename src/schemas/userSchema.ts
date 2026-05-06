import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string(),
  // phone: z.string().min(10, "Nomor terlalu pendek"),
  address: z.string().min(5, "Alamat wajib diisi"),
  tshirt_size: z.string(),
});
