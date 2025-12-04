//単体テストの自動化を勝手にしてくれてるふぁいる .specってやつはすべて同じ

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

describe('UserController', () => {
  let service: UserService;

  beforeEach(async () => {
    //テストごとに毎回呼ばれる処理
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', async () => {
    const controller = new UserController(service);
    await controller.getUser(1, 'xxx-xxx-xxx-xxx');
    expect(service.getUser).toHaveBeenCalledTimes(1);
  });
});
