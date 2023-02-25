import { DynamicConfigModule } from '@app/common';
import { Module } from '@nestjs/common';
import { RmqModule } from './mqtt';
@Module({
	imports: [DynamicConfigModule, RmqModule]
})
export class AppModule {}
