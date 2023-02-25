import { DynamicConfigModule } from '@app/common';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { RmqController } from './rmq.controller';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
	name: string;
}

@Module({
	imports: [
		DynamicConfigModule.register({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required()
			}),
			folder: '.'
		})
	],
	providers: [RmqService],
	controllers: [RmqController],
	exports: [RmqService]
})
export class RmqModule {}
