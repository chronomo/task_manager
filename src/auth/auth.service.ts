import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from 'src/dto/user.credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  async userRegitration(userInfoDto: UserCredentialsDto) {
    const { username, password } = userInfoDto;
    const salt = await bcrypt.genSalt(12);
    const hash_ps = await bcrypt.hash(password, salt);
    const user = new UserEntity();
    user.username = username;
    user.password = hash_ps;
    user.salt = salt;

    this.userRepo.create(user);

    try {
      return await this.userRepo.save(user);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async userLogin(userInfoDto: UserCredentialsDto) {
    const { username, password } = userInfoDto;
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordMatched = bcrypt.compareSync(password, user.password);
    if (passwordMatched) {
      const jwtPayload = { username };
      const jwtToken = await this.jwt.signAsync(jwtPayload, {
        expiresIn: '1d',
        algorithm: 'HS512',
      });
      return { token: jwtToken };
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}
