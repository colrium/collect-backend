import { Request } from "express"
import { User } from "@apps/auth/users/schemas/user.schema"

export interface RequestWithUser extends Request {
	user: User
}
