import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { AuthResponse, UserProfile } from './dto/auth-response.dto';
import { SuccessResponse } from '@/common/dto/responceHelper';
export declare class AuthService {
    private prismaService;
    private jwtService;
    constructor(prismaService: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<SuccessResponse<AuthResponse>>;
    login(loginDto: LoginDto): Promise<SuccessResponse<AuthResponse>>;
    getProfile(userId: string): Promise<SuccessResponse<UserProfile>>;
}
