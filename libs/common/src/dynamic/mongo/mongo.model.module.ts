import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { model, Schema, SchemaTypes } from 'mongoose';

@Module({
	imports: [MongooseModule]
})
export class DynamicMongoModelModule {
	static forRoot(dynamicModel): DynamicModule {
		const columnsObj: any = {};
		const name = dynamicModel?.name || 'test';
		if (Array.isArray(dynamicModel?.columns)) {
			for (const column of dynamicModel.columns) {
				const { name, ...rest } = column;
				columnsObj[name] = {
					type: SchemaTypes.String,
					trim: true,
					...rest
				};
			}
		}

		const schema = new Schema(columnsObj);
		const mongoModel = model(name, schema);
		const modelProvider: Provider = {
			provide: 'MONGO_MODEL',
			useValue: mongoModel
		};
		return {
			module: DynamicMongoModelModule,
			providers: [modelProvider],
			exports: [
				MongooseModule.forFeature([{ name: name, schema: schema }])
			]
		};
	}
}
