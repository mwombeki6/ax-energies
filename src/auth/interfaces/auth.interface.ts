export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface OtpVerificationResult extends AuthTokens {
  user: {
    id: string;
    phoneNumber: string;
    role: string;
  };
}