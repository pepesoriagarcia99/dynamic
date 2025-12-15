<script lang="ts">
  import { tooltip, tooltipDelay, tooltipPosition } from '../../../../tooltip/directives/tooltip';
  import { TOOLTIP_DELAY } from '../../../constant';

  interface AvatarProps {
    value: { picture: string; alt: string; name?: string };
  }

  /** Inputs */
  const { value }: AvatarProps = $props();
</script>

<div class="avatar-container" part="avatar-container">
  <img src={value.picture} alt={value.alt} class="avatar-picture" part="avatar-picture" />
  <span
    class="avatar-name"
    part="avatar-name"
    use:tooltip={value?.name ?? ''}
    use:tooltipPosition={'right'}
    use:tooltipDelay={TOOLTIP_DELAY}>{value.name}</span
  >
</div>

<style>
  .avatar-container {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .avatar-picture {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  .avatar-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
