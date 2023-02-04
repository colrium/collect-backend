import * as bcrypt from 'bcrypt';

export class Cryptography {
	static async toHash(val: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(val, salt);
	}

	static async verifyHash(val: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(val, hash);
	}

	static randomStr<
		T extends number,
		TOptions extends { uppercase: true; lowercase: true; numeric: true }
	>(length: T, opts: TOptions): string {
		const { uppercase, lowercase, numeric } = opts;
		let result = '',
			characters = '';
		if (uppercase) {
			characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
		if (lowercase) {
			characters += 'abcdefghijklmnopqrstuvwxyz';
		}
		if (numeric) {
			characters += '0123456789';
		}
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}

		return result;
	}
}
