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
			'../../',
			options.folder,
			filePath
		);
		// console.log(`process.env `, JSON.stringify(process.env));

		if (fs.existsSync(envFile)) {
			console.log(`envFile`, JSON.stringify(envFile));
			this.envConfig = dotenv.parse(fs.readFileSync(envFile));
		}
		else {
			const result = dotenv.config();
			if (!result.error) {
				this.envConfig = result.parsed;
			}
			console.log(`dotenv.config() result`, JSON.stringify(result));
		}
		console.log(`this.envConfig `, JSON.stringify(this.envConfig));
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
