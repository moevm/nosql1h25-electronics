export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type AssertSubtype<T, V> = T extends V ? T : never; 
