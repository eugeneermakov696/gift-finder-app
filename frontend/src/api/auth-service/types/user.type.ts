export type User = {
  id: number;
  email: string;
  username: string;
  image_url: string | null;
  avatar: string | null;
  role: 'customer' | 'admin';
  email_is_confirmed: boolean;
  first_name: string;
  last_name: string;
};
