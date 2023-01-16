import * as bcrypt from "bcrypt"

export class Password {
	static async toHash(password: string): Promise<string> {
		const salt = await bcrypt.genSalt()
		return await bcrypt.hash(password, salt)
	}

	static async verify(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash)
	}
}
