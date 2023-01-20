import { DynamicModule, Module, Provider } from "@nestjs/common"
import { DynamicConfigService } from './config.service';
import { CONFIG_OPTIONS } from './constants';
import { DynamicConfigOptions } from './interfaces';

@Module({})
export class DynamicConfigModule {
	static register(options: DynamicConfigOptions): DynamicModule {
		return {
			module: DynamicConfigModule,
			providers: [
				{
					provide: CONFIG_OPTIONS,
					useValue: options,
				},
				DynamicConfigService,
			],
			exports: [DynamicConfigService],
		};
	}

	static forRoot(options: DynamicConfigOptions): DynamicModule {

		return {
			module: DynamicConfigModule,
			providers: [
				{
					provide: CONFIG_OPTIONS,
					useValue: options,
				},
				DynamicConfigService,
			],
			exports: [DynamicConfigService],
		};
	}
}
