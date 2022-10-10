import { Entity, ObjectID, ObjectIdColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("attachments")
export default class Attachment {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	name: string

	@Column()
	mime: string

	@Column()
	path: string

	@Column()
	bytes: number

	@Column()
	@CreateDateColumn()
	createdAt: Date

	@Column()
	@UpdateDateColumn()
	updatedAt: Date

	constructor(attachment?: Partial<Attachment>) {
		Object.assign(this, attachment)
	}
}
