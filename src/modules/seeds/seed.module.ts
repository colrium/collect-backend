import { Module } from "@nestjs/common"
import { CommandModule } from "nestjs-command"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { UserSeed, UserModule } from "../users"

@Module({
	imports: [CommandModule, ConfigModule, UserModule],
	providers: [UserSeed],
	exports: [UserSeed],
})
export default class SeedModule {}
