import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserCredentialsDto } from 'src/dto/user.credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  UserRegitration(@Body(ValidationPipe) userInfoDto: UserCredentialsDto) {
    return this.authService.userRegitration(userInfoDto);
  }

  @Post('login')
  userLogin(@Body(ValidationPipe) userInfoDto: UserCredentialsDto) {
    return this.authService.userLogin(userInfoDto);
  }
}
