export interface UserLogin {
    id: number;
    user_id: string;
    login_at: Date;
    device_info?: string;
    ip_address?: string;
    latitude?: number;
    longitude?: number;
    created_at?: Date;
    updated_at?: Date;
}
