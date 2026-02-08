<script module lang="ts">
  let _columnIndex: number | null = $state(null);

  export function getColumnIndexOpen() {
    return _columnIndex;
  }

  export function setColumnIndexOpen(value: number | null) {
    _columnIndex = value;
  }
</script>