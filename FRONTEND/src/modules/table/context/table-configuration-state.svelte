<script module lang="ts">
  import { setContext, getContext } from 'svelte';
  import type { TableConfiguration } from '../models/configuration/TableConfiguration';

  const TABLE_CONFIGURATION_KEY = Symbol('table-configuration');

  type TableConfigurationGetter = () => TableConfiguration;

  export function initTableConfigurationContext(getter: TableConfigurationGetter): void {
    setContext(TABLE_CONFIGURATION_KEY, getter);
  }

  export function getTableConfigurationContext(): TableConfigurationGetter {
    return getContext<TableConfigurationGetter>(TABLE_CONFIGURATION_KEY);
  }
</script>