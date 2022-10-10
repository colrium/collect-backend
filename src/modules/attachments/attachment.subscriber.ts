import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm"
import Attachment from "./attachment.entity"

@EventSubscriber()
export default class AttachmentSubscriber implements EntitySubscriberInterface<Attachment> {
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this)
	}

	listenTo() {
		return Attachment
	}

	beforeInsert(event: InsertEvent<Attachment>) {
		console.log(`BEFORE USER INSERTED: `, event.entity)
	}
}
