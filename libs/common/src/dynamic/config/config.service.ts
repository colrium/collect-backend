import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_OPTIONS } from './constants';
import { DynamicConfigOptions, DynamicEnvConfig } from './interfaces';

@Injectable()
export class DynamicConfigService {
	private readonly envConfig: DynamicEnvConfig;

	constructor(@Inject(CONFIG_OPTIONS) options: DynamicConfigOptions) {

			const filePath = `${process.env.NODE_ENV || 'development'}.env`;
			const envFile = path.resolve(
				__dirname,
				'../../../',
				options.folder,
				filePath
			);
			if (fs.existsSync(envFile)) {
				const envFileContent = fs.readFileSync(envFile)
				this.envConfig = dotenv.parse(envFileContent);
			} else {
				const result = dotenv.config();
				if (!result.error) {
					this.envConfig = result.parsed;
				}
			}
	}

	get(key: string, defaultValue: any = null): any {
		return this.envConfig && key in this.envConfig
			? this.envConfig[key]
			: defaultValue;
	}
	set(key: string, value: any): void {
		this.envConfig[key] = value;
	}
}
