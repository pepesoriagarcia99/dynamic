import type { Column } from "../models/column/Column";
import type { ColorConfiguration } from "../models/column/ColumnConfiguration";

/**
 * Precompila la lógica de estilos de una columna.
 *
 * A partir de la configuración de colores de la columna, genera
 * una función ultra ligera que, dado un valor, devuelve el estilo
 * correspondiente.
 *
 * IMPORTANTE:
 * - Se ejecuta UNA sola vez por columna
 * - El resultado se usa en el hot-path del render
 * - No accede a configuración, ni hace parsing en tiempo de render
 */
export function buildStyleGetter(column: Column): (value: any) => string {
  // Extraemos la configuración de estilos una sola vez
  // Evitamos accesos profundos en cada celda
  const configStyle: ColorConfiguration<any>[] =
    (column.configuration as any)?.colorConfiguration ?? [];

  // Fast-path:
  // Si la columna no tiene configuración de estilos,
  // devolvemos directamente una función constante
  if (configStyle.length === 0) {
    return () => '';
  }

  /**
   * Normalizamos todas las reglas de estilo en estructuras planas
   * y homogéneas para que el render solo tenga comparaciones simples.
   *
   * Cada regla queda convertida en:
   * - isRange = true  → comparación numérica
   * - isRange = false → comparación por igualdad
   */
  const rules = new Array(configStyle.length);

  for (let i = 0; i < configStyle.length; i++) {
    const config = configStyle[i];

    if (config.range) {
      // Regla por rango numérico
      rules[i] = {
        isRange: true,
        min: Number(config.range.min),
        max: Number(config.range.max),
        style: config.style as string
      };
    } else {
      // Regla por valor exacto
      rules[i] = {
        isRange: false,
        value: String(config.value),
        style: config.style as string
      };
    }
  }

  /**
   * Getter de estilo precompilado.
   *
   * Esta función es la que se ejecuta por cada celda.
   * Debe ser lo más pequeña y rápida posible.
   */
  return function (value: any): string {
    // Early-exit: valores nulos no tienen estilo
    if (value == null) return '';

    // Convertimos UNA sola vez
    // Evitamos repetir Number() y String() por regla
    const numValue = Number(value);
    const strValue = String(value);

    // Loop clásico (más rápido que forEach)
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];

      if (rule.isRange) {
        // Comparación por rango numérico
        if (numValue >= rule.min && numValue <= rule.max) {
          return rule.style;
        }
      } else {
        // Comparación por valor exacto
        if (strValue === rule.value) {
          return rule.style;
        }
      }
    }

    // Ninguna regla aplica
    return '';
  };
}
