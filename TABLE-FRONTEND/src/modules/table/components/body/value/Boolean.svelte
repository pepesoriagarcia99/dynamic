<script lang="ts">
  import checkIcon from '../../../../../assets/svg/check.svg';
  import cancelIcon from '../../../../../assets/svg/cancel.svg';

  interface BooleanValueProps {
    value: boolean;
  }

  /** Inputs */
  const { value }: BooleanValueProps = $props();
</script>

{#if value}
  <img src={checkIcon} class="true" alt="true" />
{:else}
  <img src={cancelIcon} class="false" alt="false" />
{/if}

<style>
  img {
    width: 26px;
    height: 26px;
  }

  .true {
    filter: invert(39%) sepia(83%) saturate(441%) hue-rotate(81deg) brightness(90%) contrast(90%);
  }

  .false {
    filter: invert(19%) sepia(91%) saturate(7463%) hue-rotate(358deg) brightness(91%) contrast(101%);
  }
</style>
