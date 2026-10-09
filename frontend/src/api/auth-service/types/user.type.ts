export type User = {
  id: number;
  username: string; // Used as email in Django
  image_url: string | null;
  avatar: string | null;
  role: 'customer' | 'admin';
  email_is_confirmed: boolean;
  first_name: string;
  last_name: string;
};
