import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "../dto/login.dto"
import * as bcrypt from 'bcrypt'
import { UsersService } from "src/modules/users/services/users.service"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)

    if (!user) throw new UnauthorizedException()

    const match = await bcrypt.compare(dto.password, user.password)
    if (!match) throw new UnauthorizedException()

    return this.generateToken(user.id)
  }

  private generateToken(userId: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId }),
    }
  }
}