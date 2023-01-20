import { DynamicModule, Module, Provider } from "@nestjs/common"
import { Prop } from "@nestjs/mongoose"
import { SchemaTypes, Types, Document, model, Schema } from "mongoose"
import { Expose, Exclude, Transform } from "class-transformer"


@Module({})
export class DynamicControllerModule {
	static forRoot(dynamicModel): DynamicModule {
		const columnsObj: any = {}
		if (Array.isArray(dynamicModel?.columns)) {
			for (const column of dynamicModel.columns) {
				const { name, ...rest } = column
				columnsObj[name] = {
					type: SchemaTypes.String,
					trim: true,
					...rest,
				}
			}
		}

		const schema = new Schema(columnsObj)
		const mongoModel = model(dynamicModel?.name || "test", schema)
		const modelProvider: Provider = {
			provide: "MONGO_MODEL",
			useValue: mongoModel,
		}
		return {
			module: DynamicControllerModule,
			providers: [modelProvider],
			exports: [modelProvider],
			global: true,
		};
	}
}
