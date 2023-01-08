import { Test, TestingModule } from '@nestjs/testing';
import { ReactService } from 'apps/posts/services';
import { ReactController } from './react.controller';

describe('ReactController', () => {
  let controller: ReactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactController],
      providers: [ReactService],
    }).compile();

    controller = module.get<ReactController>(ReactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
