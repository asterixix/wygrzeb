'use client';

import * as React from 'react';
import createCache, { EmotionCache } from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

export type NextAppDirEmotionCacheProviderProps = {
  options: Parameters<typeof createCache>[0];
  CacheProvider?: React.ComponentType<{
    value: EmotionCache;
    children: React.ReactNode;
  }>;
  children: React.ReactNode;
};

export function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [registry] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: { name: string; styles: string }[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          styles: serialized.styles,
        });
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) {
      return null;
    }
    let styles = '';
    for (const { name, styles: style } of inserted) {
      styles += `<style data-emotion="${options.key} ${name}">${style}</style>`;
    }
    return <div dangerouslySetInnerHTML={{ __html: styles }} />;
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
