import { Test, TestingModule } from '@nestjs/testing';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';

describe('MessagingController', () => {
  let messagingController: MessagingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessagingController],
      providers: [MessagingService],
    }).compile();

    messagingController = app.get<MessagingController>(MessagingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(messagingController.getHello()).toBe('Hello World!');
    });
  });
});
