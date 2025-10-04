export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "pengguna" | "admin" | "superadmin";
  created_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}
