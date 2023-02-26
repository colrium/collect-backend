export interface QueryParserOptions {
	dateFormat?: string | string[];
	blacklist?: string[]; // list of fields should not be in filter
	casters?: { [key: string]: (val: string) => any };
	castParams?: { [key: string]: string };
	// rename the keys
	selectKey?: string;
	populateKey?: string;
	sortKey?: string;
	skipKey?: string;
	limitKey?: string;
	filterKey?: string;
}
