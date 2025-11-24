import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { AuthResponse, UserProfile } from './dto/auth-response.dto';
import * as bcrypt from 'bcryptjs';
import {
  ApiResponseHelper,
  SuccessResponse,
} from '@/common/dto/responceHelper';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<SuccessResponse<AuthResponse>> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const authResponse: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      },
      accessToken,
    };

    return ApiResponseHelper.success(
      authResponse,
      'User registered successfully',
      201,
    );
  }

  async login(loginDto: LoginDto): Promise<SuccessResponse<AuthResponse>> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const authResponse: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      },
      accessToken,
    };

    return ApiResponseHelper.success(authResponse, 'Login successful');
  }

  async getProfile(userId: string): Promise<SuccessResponse<UserProfile>> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return ApiResponseHelper.success(
      userProfile,
      'Profile retrieved successfully',
    );
  }
}
