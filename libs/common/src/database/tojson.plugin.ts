export const toJSON = (schema: any) => {
	let transform
	if (schema.options.toJSON && schema.options.toJSON.transform) {
		transform = schema.options.toJSON.transform
	}

	schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
		transform(doc, ret, options) {
			const normalizeId = (ret) => {
				if (
					ret._id &&
					typeof ret._id === "object" &&
					ret._id.toString
				) {
					if (typeof ret.id === "undefined") {
						ret.id = ret._id.toString()
					}
				}
				if (typeof ret._id !== "undefined") {
					delete ret._id
				}
			}
			const removePrivatePaths = (ret, schema) => {
				for (const path in schema.paths) {
					if (
						schema.paths[path].options &&
						schema.paths[path].options.private
					) {
						if (typeof ret[path] !== "undefined") {
							delete ret[path]
						}
					}
				}
			}

			const removeVersion = (ret) => {
				if (typeof ret.__v !== "undefined") {
					delete ret.__v
				}
			}
			//Remove private paths
			if (schema.options.removePrivatePaths !== false) {
				removePrivatePaths(ret, schema)
			}

			//Remove version
			if (schema.options.removeVersion !== false) {
				removeVersion(ret)
			}

			//Normalize ID
			if (schema.options.normalizeId !== false) {
				normalizeId(ret)
			}

			//Call custom transform if present
			if (transform) {
				return transform(doc, ret, options)
			}

			return ret
		},
	})
}
