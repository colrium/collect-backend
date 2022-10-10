import { Injectable } from "@nestjs/common"

@Injectable()
export default class AttachmentService {
	getHello() {
		return { hello: "world" }
	}
}
