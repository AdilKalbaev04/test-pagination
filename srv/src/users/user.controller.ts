import { UserService } from './users.service';
import { Controller, Get, Logger } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    this.logger.log('Get all users');
    const { users, total } = await this.userService.findAll();

    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      total,
    };
  }
}
