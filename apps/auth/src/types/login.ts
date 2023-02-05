import { ApiProperty } from '@nestjs/swagger';


export class LoginDTO {
	@ApiProperty({
		example: 'user@example.com',
		description: 'Email or Phone',
	})
	username: string;
	@ApiProperty({
		example: 'Pj3yNRWQVCLjQfQL',
		description: `Password`,
	})
	password?: string;
}
