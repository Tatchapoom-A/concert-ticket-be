import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity'
import { randomUUID } from 'crypto'

@Injectable()
export class UsersService {
  private users: User[] = []

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email)
  }

  async findById(id: string) {
    return this.users.find((u) => u.id === id)
  }
}