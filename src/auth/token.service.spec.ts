import { faker } from '@faker-js/faker';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenActivity } from 'src/utils/enums/prisma-enums';
import { UserFactory } from 'src/utils/factories/user.factory';
import { clearDatabase } from 'src/utils/prisma/prisma.util';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/request/signIn.dto';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let prisma: PrismaService;
  let service: AuthService;
  let tokenService: TokenService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    userFactory = new UserFactory();
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, TokenService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);

    jest.clearAllMocks();
  });

  describe('createTokenRecord', () => {
    it("should thrown an error if the user doesn't exist", async () => {
      await expect(
        tokenService.createTokenRecord(
          faker.datatype.string(),
          TokenActivity.AUTHENTICATE,
        ),
      ).rejects.toThrowError(new NotFoundException('User not found'));
    });

    it('should thrown an error if user is already signed in', async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const user = await userFactory.make(data);
      await service.signIn(data as SignInDto);

      await expect(
        tokenService.createTokenRecord(user.uuid, TokenActivity.AUTHENTICATE),
      ).rejects.toThrowError(
        new ForbiddenException(
          'Forbidden signing in again. Now you are signed out.',
        ),
      );
    });
  });

  describe('generateTokenDto', () => {
    it('should generate confirm email token', async () => {
      const { uuid } = await userFactory.make();
      const activity = TokenActivity.RESET_PASSWORD;

      jest
        .spyOn(new JwtService(), 'sign')
        .mockImplementation(jest.fn(() => '13:11:07'));

      const result = await tokenService.generateTokenDto(uuid, activity);

      expect(result).toHaveProperty('token', '13:11:07');
    });
  });
});
