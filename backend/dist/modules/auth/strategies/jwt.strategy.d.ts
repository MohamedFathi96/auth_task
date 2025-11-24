import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prismaService;
    constructor(configService: ConfigService, prismaService: PrismaService);
    validate(payload: JwtPayload): Promise<{
        email: string;
        name: string | null;
        id: string;
        role: string;
        isActive: boolean;
    }>;
}
export {};
