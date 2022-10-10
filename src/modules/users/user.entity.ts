import { Entity, BaseEntity, ObjectID, ObjectIdColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Length, IsNotEmpty, IsEmail } from "class-validator"
import { Exclude } from "class-transformer"
import * as bcrypt from "bcrypt"
import UserRole from "./user.role.enum"

const SALT_ROUNDS = 10
@Entity("users")
export default class User extends BaseEntity {
	@ObjectIdColumn()
	id: ObjectID

	@IsEmail()
	@Column({
		unique: true,
	})
	@ApiProperty({ example: "user@example.com", description: "The email of the User" })
	email: string

	@Column()
	@ApiProperty({ example: "John", description: "The first name of the User" })
	firstName: string

	@Column()
	@ApiProperty({ example: "Doe", description: "The last name of the User" })
	lastName: string

	@Column()
	@Exclude()
	password: string

	@Column({
		type: "set",
		enum: UserRole,
		default: [UserRole.GUEST],
	})
	@ApiProperty({
		type: "array",
		items: {
			type: "string",
		},
		example: [UserRole.GUEST],
		description: "The roles of the User",
	})
	roles: UserRole[]

	@Column({
		default: true,
	})
	@ApiProperty({ example: true, description: "If User is Active" })
	isActive: boolean

	@Column({
		default: "local",
	})
	@ApiProperty({ example: "local", description: "The provider of the User" })
	provider: string

	@Column()
	@CreateDateColumn()
	@ApiProperty({ example: "2022-10-09T07:28:42.427Z", description: "Date the User was created" })
	createdAt: Date

	@Column()
	@UpdateDateColumn()
	@ApiProperty({ example: "2022-10-09T07:28:42.427Z", description: "Date the User was last updated" })
	updatedAt: Date

	constructor(user?: Partial<User>) {
		super()
		Object.assign(this, user)
	}

	@BeforeInsert()
	async setPassword(password: string) {
		const salt = await bcrypt.genSalt()
		this.password = await bcrypt.hash(password || this.password, salt)
		console.log("setPassword password", this.password)
	}
	public async verifyPassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password)
	}

	public verifyPasswordSync(password: string): boolean {
		return bcrypt.compareSync(password, this.password)
	}

	public static hashPassword(password: string): string {
		const salt = bcrypt.genSaltSync(SALT_ROUNDS)
		return bcrypt.hashSync(password, salt)
	}

	public static verifyUserPassword(user: User, password: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (!user || !user.password || !password) {
				resolve(false)
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (err) {
					return reject(err)
				}
				resolve(res === true)
			})
		})
	}
}
