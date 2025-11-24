import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import type { User } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../../common/dto/responceHelper").SuccessResponse<import("./dto/auth-response.dto").AuthResponse>>;
    login(loginDto: LoginDto): Promise<import("../../common/dto/responceHelper").SuccessResponse<import("./dto/auth-response.dto").AuthResponse>>;
    getProfile(user: User): Promise<import("../../common/dto/responceHelper").SuccessResponse<import("./dto/auth-response.dto").UserProfile>>;
}
