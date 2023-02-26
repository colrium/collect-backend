export interface QueryOptions {
	filter: any; // mongodb json query
	sort?: string | any; // ie.: { field: 1, field2: -1 }
	limit?: number;
	skip?: number;
	select?: string | any; // ie.: { field: 0, field2: 0 }
	populate?: string | any; // path(s) to populate:  a space delimited string of the path names or array like: [{path: 'field1', select: 'p1 p2'}, ...]
}
