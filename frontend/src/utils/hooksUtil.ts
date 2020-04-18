import { useEffect, useRef } from 'react';
import { get } from './fetchUtil';

type Callback<T> = (response: T | undefined) => void;

export function usePollApi<T>(cb: Callback<T>, url: string, delay: number = 800) {
  const savedCb = useRef<Callback<T>>();

  // Remember the latest callback.
  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      get(url).then(body => {
        if (savedCb.current) {
          savedCb.current(body);
        }
      }).catch(reason => {
        console.warn(reason);
        if (savedCb.current) {
          savedCb.current(undefined);
        }
      });
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, url]);
}
