// file containing mocked types for use in logic files

import Lapis, { Collection, Document } from "@rbxts/lapis";
import { func } from "./logictypes";

export namespace mock {
	export type Event = {
		fire: func;
	};

	export type Document<T extends object, R = true> = {
		read(): T;
		write(data: T): void;
	};

	export type Collection<T extends object, R = true> = {
		load(name: string, ids: number[]): Promise<Document<T, R>>;
	};

	export type Lapis = {
		createCollection<T extends object>(
			name: string,
			options: {
				defaultData: T;
				validate: func;
				migrations?: func[];
			},
		): Collection<T>;
	};
}

namespace actual {
	type ADocument<T extends object> = Document<T, true>;

	type ACollection<T extends object> = Collection<T, true>;

	type ALapis = typeof Lapis;
}
