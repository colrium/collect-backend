import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Types } from 'mongoose';
import { TokenPayload } from '../auth.service';
import { UsersService } from '../users/users.service';
import { DynamicConfigService } from '@app/common';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: DynamicConfigService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				(request: any) => {
					return request?.Authorization || request?.Authentication;
				},
			]),
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate({ sub }: TokenPayload) {
		try {
			return await this.usersService.findOne({
				_id: new Types.ObjectId(sub),
			});
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
