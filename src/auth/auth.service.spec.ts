import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenActivity } from 'src/utils/enums/prisma-enums';
import { TokenFactory } from 'src/utils/factories/token.factory';
import { UserFactory } from 'src/utils/factories/user.factory';
import { clearDatabase } from 'src/utils/prisma/prisma.util';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/request/register.dto';
import { SignInDto } from './dtos/request/signIn.dto';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let prisma: PrismaService;
  let service: AuthService;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;

  beforeAll(async () => {
    userFactory = new UserFactory();
    tokenFactory = new TokenFactory();
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

    jest.clearAllMocks();
  });

  describe('register', () => {
    let data: RegisterDto;

    beforeEach(() => {
      data = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as RegisterDto;
    });

    it('should throw error if email already registered', async () => {
      const data = await userFactory.make();
      await expect(
        service.register(plainToInstance(RegisterDto, data)),
      ).rejects.toThrowError(
        new BadRequestException('Email already registered'),
      );
    });

    it('should return tokenDto if input data is ok', async () => {
      const result = await service.register(data);

      expect(result).toHaveProperty('token');
    });
  });

  describe('signIn', () => {
    let dataSignIn: SignInDto;

    beforeEach(() => {
      dataSignIn = plainToInstance(SignInDto, {
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });

    it('should throw an error if user not found', async () => {
      await expect(service.signIn(dataSignIn)).rejects.toThrowError(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw an error if incorrect password', async () => {
      const { email } = await userFactory.make();
      dataSignIn = { ...dataSignIn, email } as SignInDto;

      await expect(service.signIn(dataSignIn)).rejects.toThrowError(
        new UnauthorizedException('Invalid password'),
      );
    });

    it('should create authorization token', async () => {
      const password = faker.internet.password();
      const { email } = await userFactory.make({ password });
      dataSignIn = plainToInstance(SignInDto, {
        password,
        email,
      });

      await expect(service.signIn(dataSignIn)).resolves.toHaveProperty('token');
    });
  });

  describe('signOut', () => {
    it('should throw error if invalid token', async () => {
      const token = { token: faker.datatype.string() };
      await expect(service.signOut(token)).rejects.toThrowError(
        new PreconditionFailedException('Signed out'),
      );
    });

    it('should delete the token', async () => {
      const token = await tokenFactory.make({
        sub: faker.datatype.string(),
        activity: TokenActivity.AUTHENTICATE,
        user: { connect: { uuid: (await userFactory.make()).uuid } },
      });

      jest
        .spyOn(new JwtService(), 'verify')
        .mockImplementation(jest.fn(() => ({ sub: token.sub })));

      const result = await service.signOut({ token: faker.datatype.string() });

      expect(result).toBeUndefined();
    });
  });
});
