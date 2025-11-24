export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name?: string;
        role: string;
    };
    accessToken: string;
}
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
