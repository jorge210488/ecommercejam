export interface SigninResponse {
    message: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  }
  