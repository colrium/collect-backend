import { Test } from "@nestjs/testing"
import { CommandModule, CommandModuleTest } from "nestjs-command"
import { AppModule } from "../app.module"
import UserRole from "./user.role.enum"

describe("AppModule", () => {
	let commandModule: CommandModuleTest

	beforeEach(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		const app = moduleFixture.createNestApplication()
		await app.init()
		commandModule = new CommandModuleTest(app.select(CommandModule))
	})

	it("test command module", async () => {
		const command = "create:user <email>"
		const args = { email: "test@test.com", firstName: "FirstName", lastName: "LastName", password: "password", roles: [UserRole.GUEST], provider: "local" }

		const user = await commandModule.execute(command, args)
		expect(user.email).toBe(args.email)
		expect(user.firstName).toBe(args.firstName)
		expect(user.lastName).toBe(args.lastName)
		expect(user.roles).toBe(args.roles)
		expect(user.password).toBe(args.password)
		expect(user.provider).toBe(args.provider)
	})
})
