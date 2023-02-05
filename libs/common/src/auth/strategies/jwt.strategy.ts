import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Types } from 'mongoose';
import { TokenPayload, AuthService } from '../auth.service';
import { DynamicConfigService } from '../../dynamic';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: DynamicConfigService,
		private readonly authService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				(request: any) => {
					return request?.Authorization || request?.Authentication;
				}
			]),
			secretOrKey: configService.get('JWT_SECRET')
		});
	}

	async validate({ sub }: TokenPayload) {
		try {
			return await this.authService.findOne({
				_id: new Types.ObjectId(sub)
			});
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
