<script lang="ts">
  // @ts-ignore
  import AdvanceFilter from '../modules/filter/components/AdvanceFilter.svelte';
  // @ts-ignore
  import BasicControl from '../modules/controls/components/BasicControl.svelte';
  // @ts-ignore
  import SelectorControl from '../modules/controls/components/SelectorControl.svelte';
</script>

<div>
  <dyn-advance-filter
    index={1}
    columnField="exampleColumn"
    onOpen={(index: number) => console.log('Opened filter at index:', index)}
  ></dyn-advance-filter>
</div>

<style>
</style>
