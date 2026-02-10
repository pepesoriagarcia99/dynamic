<script module lang="ts">
  import { setContext, getContext } from 'svelte';
  import type { TableConfiguration } from '../models/configuration/TableConfiguration';

  const TABLE_CONFIGURATION_KEY = Symbol('table-configuration');

  export function initTableConfigurationContext(config: TableConfiguration): void {
    setContext(TABLE_CONFIGURATION_KEY, Object.freeze(config));
  }

  export function getTableConfigurationContext(): Readonly<TableConfiguration> {
    return getContext<Readonly<TableConfiguration>>(TABLE_CONFIGURATION_KEY);
  }
</script>