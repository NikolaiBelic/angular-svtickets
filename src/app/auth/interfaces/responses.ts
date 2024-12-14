import { User } from './UserAuth';

export interface TokenResponse {
    accessToken: string;
}

export interface SingleUserResponse {
    user: User;
}