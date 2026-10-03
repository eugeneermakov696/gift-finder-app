export type AuthResponse = {
  status?: string;
  // Tokens are handled in cookies, so we don't expect them in the body
};
