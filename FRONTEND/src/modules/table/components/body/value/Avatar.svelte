<script lang="ts">
  interface AvatarProps {
    value: { picture: string; alt: string; name?: string};
  }

  /** Inputs */
  const { value }: AvatarProps = $props();
</script>

<div class="avatar-container" part="avatar-container">
  <img src={value.picture} alt={value.alt} class="avatar" />
  <span>{value.name}</span>
</div>

<style>

  .avatar-container {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
</style>
