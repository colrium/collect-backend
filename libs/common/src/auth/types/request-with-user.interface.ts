import { Request } from "express"
import { User } from "../user.schema"

export interface RequestWithUser extends Request {
	user: User
}
