type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export declare function useMatchContainer<T extends string[]>(
  queries: T
): {
  ref: React.RefObject<HTMLDivElement>;
  matches: Tuple<boolean, T['length']>;
};

export declare function useMatchContainer<T extends string[]>(
  queries: T
): {
  ref: React.RefObject<HTMLElement>;
  matches: Tuple<boolean, T['length']>;
};
