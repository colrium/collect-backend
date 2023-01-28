import {
	ApiProperty,
} from '@nestjs/swagger';

export enum ForgotPasswordDTOViaEnum {
	SMS = "sms",
	MAIL = "mail",
}

export class ForgotPasswordDTO {
	@ApiProperty({ example: 'user@example.com', description: 'The Recovery account email or phone' })
	username: string;
	@ApiProperty({ example: 'mail', description: 'The Recovery mode to use' })
	via?: ForgotPasswordDTOViaEnum;
}

export class ForgotPasswordResponse {
	@ApiProperty({ example: 'Account Recovery mail sent with instrunctions on how to proceed', description: 'Status of the initiated account recovery' })
	message: string;
}

export class ResetPasswordDTO {
	@ApiProperty({
		example: 'C1O2DE',
		description: 'The Account Recovery CODE',
	})
	code: string;

	@ApiProperty({
		example: 'Pj3yNRWQVCLjQfQL',
		description: 'Strong New Password ',
	})
	password: string;

	@ApiProperty({
		example: 'Pj3yNRWQVCLjQfQL',
		description: 'Confirm New Password ',
	})
	confirmPassword: string;
}

export class ResetPasswordResponse {
	@ApiProperty({
		example:
			'Account Password reset',
		description: 'Status of the initiated password reset',
	})
	message: string;
}
