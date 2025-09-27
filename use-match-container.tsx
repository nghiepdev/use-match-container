import {useCallback, useState} from 'react';

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export function useMatchContainer<T extends string[]>(queries: T) {
  const [matches, setMatches] = useState(() => queries.map(() => false));

  const eleCallbackRef = useCallback(
    async (node: HTMLElement | null) => {
      await import('match-container');
      if (node instanceof HTMLElement) {
        const containerQueries = queries.map(
          (query) => [node.matchContainer(query), query] as const
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
      }
    },
    [queries]
  );

  return {
    ref: eleCallbackRef,
    matches: matches as Tuple<boolean, T['length']>,
  };
}
