<script module lang="ts">
  import { setContext, getContext } from 'svelte';

  const LOADING_KEY = Symbol('loading');

  type LoadingGetter = () => boolean;

  export function initLoadingContext(getter: LoadingGetter): void {
    setContext(LOADING_KEY, getter);
  }

  export function getLoadingContext(): LoadingGetter {
    return getContext<LoadingGetter>(LOADING_KEY);
  }
</script>