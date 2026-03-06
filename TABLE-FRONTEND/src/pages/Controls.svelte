<script lang="ts">
  // @ts-ignore
  import BasicControl from '../modules/controls/components/BasicControl.svelte';
  // import SelectorControl from '../modules/controls/components/SelectorControl.svelte';
  // import CheckControl from '../modules/controls/components/CheckControl.svelte';
</script>

<div class="content">
  <h3>Basico tipo text</h3>
  <dyn-basic-control
    label="Control externo de prueba"
    placeholder="Escribe algo y presiona enter"
    value={'valor test'}
    type="text"
    tooltip="Este es un tooltip de explicacion para el control externo"
    onChange={(value: any) => alert(`Valor ingresado: ${value}`)}
  ></dyn-basic-control>

  <!-- <h3>Basico tipo number</h3>
  <BasicControl
    label="Control externo de prueba"
    placeholder="Escribe algo y presiona enter"
    value={'valor test'}
    type="number"
    tooltip="Este es un tooltip de explicacion para el control externo"
    onChange={(value: any) => alert(`Valor ingresado: ${value}`)}
  />

  <h3>Selector</h3>
  <SelectorControl
    label="Selector externo de prueba"
    placeholder="Selecciona una opcion"
    options={['option1', 'option2', 'option3']}
    value={'option1'}
    tooltip="Este es un tooltip de explicacion para el selector externo"
    onChange={(value: any) => alert(`Valor seleccionado: ${value}`)}
  />

  <h3>Check 3 estados</h3>
  <CheckControl
    label="Check externo de prueba"
    value={true}
    tooltip="Este es un tooltip de explicacion para el check externo"
    triState={true}
    onChange={(value: any) => alert(`Valor seleccionado: ${value}`)}
  />

  <h3>Check 2 estados</h3>
  <CheckControl
    label="Check externo de prueba"
    value={true}
    tooltip="Este es un tooltip de explicacion para el check externo"
    triState={false}
    onChange={(value: any) => alert(`Valor seleccionado: ${value}`)}
  /> -->
</div>

<style>
  .content {
    padding: 1rem;
    height: 100%;
    width: 100%;
  }
</style>
