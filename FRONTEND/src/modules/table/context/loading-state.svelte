<script module lang="ts">
  let _loading = $state(false);

  export function loadingState() {
    return _loading;
  }

  export function setLoadingState(value: boolean) {
    _loading = value;
  }
</script>