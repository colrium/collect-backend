import { Request } from "express"
import { User } from '../models';

export interface RequestWithUser extends Request {
	user: User
}
