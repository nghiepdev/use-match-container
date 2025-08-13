/// <reference path="./global.ts" />

if (typeof window !== 'undefined') {
  import('match-container');
}

import {useEffect, useRef, useState} from 'react';

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export function useMatchContainer<T extends string[]>(queries: T) {
  const [matches, setMatches] = useState<boolean[]>([]);
  const eleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const containerQueries = queries.map(
      (query) => [eleRef.current?.matchContainer(query), query] as const
    );

    function handle(e: Event) {
      const event = e as ContainerQueryListEvent;
      setMatches((prev) => {
        const newMatches = [...prev];
        const queryIndex = queries.indexOf(event.container);
        if (queryIndex !== -1) {
          newMatches[queryIndex] = event.matches;
        }
        return newMatches;
      });
    }

    containerQueries.forEach(([containerQuery, query]) => {
      setMatches((prev) => {
        const newMatches = [...prev];
        const queryIndex = queries.indexOf(query);
        if (queryIndex !== -1) {
          newMatches[queryIndex] = containerQuery
            ? containerQuery.matches
            : false;
        }
        return newMatches;
      });

      containerQuery?.addEventListener('change', handle);
    });

    return () => {
      containerQueries.forEach(([containerQuery]) => {
        containerQuery?.removeEventListener('change', handle);
      });
    };
  }, [queries]);

  return {
    ref: eleRef,
    matches: matches as Tuple<boolean, T['length']>,
  };
}
