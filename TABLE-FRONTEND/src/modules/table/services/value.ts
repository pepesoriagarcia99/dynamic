type PathPart = string | number;

/**
 * Precompila una función de acceso profundo a partir de column.key
 *
 * Se ejecuta UNA sola vez por columna
 * El resultado es una función ultra barata
 */
export function buildValueGetter(key: string): (row: any) => any {
  // Fast-path: acceso directo (sin '.','[')
  if (key.indexOf('.') === -1 && key.indexOf('[') === -1) {
    return function (row: any) {
      return row[key];
    };
  }

  // Parse del path (una sola vez)
  const parts: PathPart[] = [];
  const segments = key.split('.');

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const bracketIndex = segment.indexOf('[');

    if (bracketIndex === -1) {
      parts.push(segment);
    } else {
      if (bracketIndex > 0) {
        parts.push(segment.slice(0, bracketIndex));
      }
      parts.push(+segment.slice(bracketIndex + 1, -1));
    }
  }

  // Getter ultra ligero
  return function (row: any) {
    let current = row;

    for (let i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i] as any];
    }

    return current;
  };
}

