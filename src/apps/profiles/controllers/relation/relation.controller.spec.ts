import { Test, TestingModule } from '@nestjs/testing'
import { RelationService } from 'apps/profiles/services'
import { RelationController } from './relation.controller'

describe('RelationController', () => {
  let controller: RelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationController],
      providers: [RelationService],
    }).compile();

    controller = module.get<RelationController>(RelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
