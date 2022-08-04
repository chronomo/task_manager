import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserCredentialsDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
    },
  )
  password: string;
}
