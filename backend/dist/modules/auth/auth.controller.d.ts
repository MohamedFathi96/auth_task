import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../../common/dto/responceHelper").SuccessResponse<import("./dto/auth-response.dto").AuthResponse>>;
    login(loginDto: LoginDto): Promise<import("../../common/dto/responceHelper").SuccessResponse<import("./dto/auth-response.dto").AuthResponse>>;
    getProfile(user: any): Promise<import("../../common/dto/responceHelper").SuccessResponse<import("./dto/auth-response.dto").UserProfile>>;
}
