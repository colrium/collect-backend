/* eslint-disable @typescript-eslint/no-this-alias */
import * as _ from 'lodash';
import * as qs from 'querystring';
import { QueryOptions, QueryParserOptions } from '../types';
import { toDate } from './to.date';

export class QueryParser {
	private readonly builtInCaster = {
		string: (val) => String(val),
		date: (val) => {
			const dt = toDate(val, this.options.dateFormat);
			if (dt instanceof Date) {
				return dt;
			} else {
				throw new Error(`Invalid date string: [${val}]`);
			}
		}
	};

	private readonly operators = [
		{ operator: 'select', method: this.castSelect, defaultKey: 'select' },
		{
			operator: 'populate',
			method: this.castPopulate,
			defaultKey: 'populate'
		},
		{ operator: 'sort', method: this.castSort, defaultKey: 'sort' },
		{ operator: 'skip', method: this.castSkip, defaultKey: 'skip' },
		{ operator: 'limit', method: this.castLimit, defaultKey: 'limit' },
		{ operator: 'filter', method: this.castFilter, defaultKey: 'filter' }
	];

	constructor(private options: QueryParserOptions = {}) {
		// add builtInCaster
		this.options.casters = Object.assign(
			this.builtInCaster,
			options.casters
		);

		// build blacklist
		this.options.blacklist = options.blacklist || [];
		this.operators.forEach(({ operator, method, defaultKey }) => {
			this.options.blacklist.push(
				this.options[`${operator}Key`] || defaultKey
			);
		});
	}

	/**
	 * parses query string/object to Mongoose friendly query object/QueryOptions
	 * @param {string | Record<string, any>} query
	 * @param {Record<string, any>} [context]
	 * @return {QueryOptions}
	 */
	parse(
		query: string | Record<string, any>,
		context?: Record<string, any>
	): QueryOptions {
		const params = typeof query === 'string' ? qs.parse(query) : query;
		const options = this.options;
		let result = {};

		this.operators.forEach(({ operator, method, defaultKey }) => {
			const key = options[`${operator}Key`] || defaultKey;
			const value = params[key];

			if (value || operator === 'filter') {
				result[operator] = method.call(this, value, params);
			}
		}, this);

		result = this.parsePredefinedQuery(result, context);
		return result as QueryOptions;
	}

	/**
	 * parses string to typed values
	 * This methods will apply auto type casting on Number, RegExp, Date, Boolean and null
	 * Also, it will apply defined casters in given options of the instance
	 * @param {string} value
	 * @param {string} key
	 * @return {any} typed value
	 */
	parseValue(value: string, key?: string): any {
		const me = this;
		const options = this.options;

		// Apply casters
		// Match type casting operators like: string(true), _caster(123), $('test')
		const casters = options.casters;
		const casting = value.match(/^([a-zA-Z_$][0-9a-zA-Z_$]*)\((.*)\)$/);
		if (casting && casters[casting[1]]) {
			return casters[casting[1]](casting[2]);
		}

		// Apply casters per params
		if (
			key &&
			options.castParams &&
			options.castParams[key] &&
			casters[options.castParams[key]]
		) {
			return casters[options.castParams[key]](value);
		}

		// cast array
		if (value.includes(',')) {
			return value.split(',').map((val) => me.parseValue(val, key));
		}

		// Apply type casting for Number, RegExp, Date, Boolean and null
		// Match regex operators like /foo_\d+/i
		const regex = value.match(/^\/(.*)\/(i?)$/);
		if (regex) {
			return new RegExp(regex[1], regex[2]);
		}

		// Match boolean values
		if (value === 'true') {
			return true;
		}
		if (value === 'false') {
			return false;
		}

		// Match null
		if (value === 'null') {
			return null;
		}

		// Match numbers (string padded with zeros are not numbers)
		if (value !== '' && !isNaN(Number(value)) && !/^0[0-9]+/.test(value)) {
			return Number(value);
		}

		// Match dates
		const dt = toDate(value, this.options.dateFormat);
		if (dt instanceof Date) {
			return dt;
		}

		return value;
	}

	private excludeFilterKeys(obj: any, blacklist: string[]) {
		for (const i in obj) {
			if (!obj.hasOwnProperty(i)) {
				continue;
			}
			if (typeof obj[i] == 'object') {
				this.excludeFilterKeys(obj[i], blacklist);
			} else if (blacklist.indexOf(i) !== -1) {
				delete obj[i];
			}
		}
		return Array.isArray(obj) ? _.remove(obj, (el) => _.isEmpty(el)) : obj;
	}

	private castFilter(filter, params) {
		const options = this.options;
		const parsedFilter = filter ? this.parseFilter(filter) : {};

		// filter out blacklisted keys in JSON filter query
		const subsetParsedFilter = this.excludeFilterKeys(
			parsedFilter,
			options.blacklist
		);

		return Object.keys(params)
			.map((val) => {
				const join = params[val] ? `${val}=${params[val]}` : val;
				// Separate key, operators and value
				const [, prefix, key, op, value] = join.match(
					/(!?)([^><!=]+)([><]=?|!?=|)(.*)/
				);
				return {
					prefix,
					key,
					op: this.parseOperator(op),
					value: this.parseValue(value, key)
				};
			})
			.filter(({ key }) => options.blacklist.indexOf(key) === -1)
			.reduce((result, { prefix, key, op, value }) => {
				if (!result[key]) {
					result[key] = {};
				}

				if (Array.isArray(value)) {
					result[key][op === '$ne' ? '$nin' : '$in'] = value;
				} else if (op === '$exists') {
					result[key][op] = prefix !== '!';
				} else if (op === '$eq') {
					result[key] = value;
				} else if (op === '$ne' && typeof value === 'object') {
					result[key].$not = value;
				} else {
					result[key][op] = value;
				}

				return result;
			}, subsetParsedFilter);
	}

	private parseFilter(filter) {
		try {
			if (typeof filter === 'object') {
				return filter;
			}
			return JSON.parse(filter);
		} catch (err) {
			throw new Error(`Invalid JSON string: ${filter}`);
		}
	}

	private parseOperator(operator) {
		if (operator === '=') {
			return '$eq';
		} else if (operator === '!=') {
			return '$ne';
		} else if (operator === '>') {
			return '$gt';
		} else if (operator === '>=') {
			return '$gte';
		} else if (operator === '<') {
			return '$lt';
		} else if (operator === '<=') {
			return '$lte';
		} else if (!operator) {
			return '$exists';
		}
	}

	/**
	 * cast select query to object like:
	 * select=a,b or select=-a,-b
	 * =>
	 * {select: { a: 1, b: 1 }} or {select: { a: 0, b: 0 }}
	 * @param val
	 */
	private castSelect(val) {
		const fields = this.parseUnaries(val, { plus: 1, minus: 0 });

		/*
      From the MongoDB documentation:
      "A projection cannot contain both include and exclude specifications, except for the exclusion of the _id field."
    */
		const hasMixedValues =
			Object.keys(fields).reduce((set, key) => {
				if (key !== '_id') {
					set.add(fields[key]);
				}
				return set;
			}, new Set()).size > 1;

		if (hasMixedValues) {
			Object.keys(fields).forEach((key) => {
				if (fields[key] === 1) {
					delete fields[key];
				}
			});
		}

		return fields;
	}

	/**
	 * cast populate query to object
	 * see mongoose doc here: https://mongoosejs.com/docs/populate.html#deep-populate
	 * considering the following schemas:
	 * Users => { _id, name:string, email:string, friends: [{ref: 'User'}] }
	 * Posts => { createdBy: {ref: 'User'}, likedBy: [{ref: 'User'}], contents: string, title: string }
	 * Example 1:
	 * populate=createdBy.name,createdBy.email,likedBy
	 * =>
	 * [{path: 'createdBy', select: 'name email'}, {path: 'likedBy'}]
	 * Example 2 (deep populate):
	 * populate=createdBy:friends.name,createdBy:friends.email,createdBy.name,createdBy.email
	 * =>
	 * [{path: 'createdBy', select: 'name email', populate: {path: 'friends', select: 'name email'}}]
	 * @param val
	 */
	private castPopulate(val: string) {
		const ls = val.split(',').map((s) => s.split(':'));
		const populates = [];
		const buildPopulate = (prop: string, pObj) => {
			const [path, select] = prop.split('.', 2);
			if (!pObj) {
				pObj = populates.find((p) => p.path == path);
				if (!pObj) {
					// create new populate query object
					pObj = { path };
					populates.push(pObj);
				}
			} else {
				if (pObj.populate?.path !== path) {
					// create deep populate
					pObj.populate = { path };
				}
				pObj = pObj.populate;
			}
			if (select) {
				pObj.select = pObj.select ? pObj.select + ' ' + select : select;
			}
			return pObj;
		};
		for (const s of ls) {
			let pObj = undefined;
			for (const prop of s) {
				pObj = buildPopulate(prop, pObj);
			}
		}
		return populates;
	}

	/**
	 * cast sort query to object like
	 * sort=-a,b
	 * =>
	 * {sort: {a: -1, b: 1}}
	 * @param sort
	 */
	private castSort(sort: string) {
		return this.parseUnaries(sort);
	}

	/**
	 * Map/reduce helper to transform list of unaries
	 * like '+a,-b,c' to {a: 1, b: -1, c: 1}
	 */
	private parseUnaries(unaries, values = { plus: 1, minus: -1 }) {
		const unariesAsArray =
			typeof unaries === 'string' ? unaries.split(',') : unaries;

		return unariesAsArray
			.map((x) => x.match(/^(\+|-)?(.*)/))
			.reduce((result, [, val, key]) => {
				result[key.trim()] = val === '-' ? values.minus : values.plus;
				return result;
			}, {});
	}

	/**
	 * cast skip query to object like
	 * skip=100
	 * =>
	 * {skip: 100}
	 * @param skip
	 */
	private castSkip(skip: string) {
		return Number(skip);
	}

	/**
	 * cast limit query to object like
	 * limit=10
	 * =>
	 * {limit: 10}
	 * @param limit
	 */
	private castLimit(limit: string) {
		return Number(limit);
	}

	/**
	 * transform predefined query strings defined in query string to the actual query object out of the given context
	 * @param query
	 * @param context
	 */
	private parsePredefinedQuery(query, context?: Record<string, any>) {
		if (context) {
			// check if given string is the format as predefined query i.e. ${query}
			const _match = (str) => {
				const reg = /^\$\{([a-zA-Z_$][0-9a-zA-Z_$]*)\}$/;
				const match = str.match(reg);
				let val = undefined;
				if (match) {
					val = _.property(match[1])(context);
					if (val === undefined) {
						throw new Error(
							`No predefined query found for the provided reference [${match[1]}]`
						);
					}
				}
				return { match: !!match, val: val };
			};
			const _transform = (obj) => {
				return _.reduce(
					obj,
					(prev, curr, key) => {
						let val = undefined,
							match = undefined;
						if (_.isString(key)) {
							({ match, val } = _match(key));
							if (match) {
								if (_.has(curr, '$exists')) {
									// 1). as a key: {'${qry}': {$exits: true}} => {${qry object}}
									return _.merge(prev, val);
								} else if (_.isString(val)) {
									// 1). as a key: {'${qry}': 'something'} => {'${qry object}': 'something'}
									key = val;
								} else {
									throw new Error(
										`Invalid query string at ${key}`
									);
								}
							}
						}
						if (_.isString(curr)) {
							({ match, val } = _match(curr));
							if (match) {
								_.isNumber(key)
									? (prev as any).push(val) // 3). as an item of array: ['${qry}', ...] => [${qry object}, ...]
									: (prev[key] = val); // 2). as a value: {prop: '${qry}'} => {prop: ${qry object}}
								return prev;
							}
						}
						if (
							_.isObject(curr) &&
							!_.isRegExp(curr) &&
							!_.isDate(curr)
						) {
							// iterate all props & keys recursively
							_.isNumber(key)
								? (prev as any).push(_transform(curr))
								: (prev[key] = _transform(curr));
						} else {
							_.isNumber(key)
								? (prev as any).push(curr)
								: (prev[key] = curr);
						}
						return prev;
					},
					Array.isArray(obj) ? [] : {}
				);
			};
			return _transform(query);
		}
		return query;
	}
}
