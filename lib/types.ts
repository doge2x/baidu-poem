export type ApiRes<T> = T | ApiError;

export interface OauthError {
  error: string;
  error_description: string;
}

export interface OauthRes {
  access_token: string;
  expires_in: string;
}

export interface ApiError {
  error_code: number;
  error_msg: string;
}

export interface GetPoem {
  text: string;
  index?: number;
}

export interface GetPoemRes {
  poem: Poem[];
}

export interface Poem {
  title: string;
  content: string;
}
