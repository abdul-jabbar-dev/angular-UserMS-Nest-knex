import  ENV  from 'src/util/ENV';
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: {
    username: string;
    id: string;
    email: string;
    role:string
  }): Promise<string> { 
    return this.jwtService.sign(user, { secret: ENV.SECRET });
  }
  async decryptToken(token:string): Promise<string> { 
    return await this.jwtService.decode(token)
  }
}
