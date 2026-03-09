declare module '#oidc-auth' {
  interface UserSession {
    claims: {
      email: string;
      given_name: string;
      family_name: string;
      edumember_is_member_of: string[];
    }
  }
}

export {}