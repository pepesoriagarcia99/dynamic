
export class EditorConditional {
  column: string;
  value: string;
  operator: string;

  next?: EditorConditional;

  constructor(column: string, operator: string, value: string) {
    this.column = column;
    this.value = value == "[null]" || value == "[NULL]" ? undefined : value;
    this.operator = operator;
  }

  pass(data: any): boolean {
    const currentValue = data[this.column]?.value;
    let pass = false;


    // Procesar filtro
    switch (this.operator) {
      case "==":
        pass = currentValue == this.value;
        break;
      case "!=":
        pass = currentValue != this.value;
        break;
      case "<=":
        pass = currentValue <= this.value;
        break;
      case ">=":
        pass = currentValue >= this.value;
        break;
      case "<":
        pass = currentValue < this.value;
        break;
      case ">":
        pass = currentValue > this.value;
        break;
    }

    // Concat
   return pass && (this.next ? this.next.pass(data) : true);
  }
}


/**
 * Parseador de conditional
 */
export default class ConditionalParser {

  /**
   * Index actual
   * @private
   */
  #currentIndex: number;

  /**
   * Input de entrada
   * @private
   */
  #input: string;

  /**
   * Si ha habido error
   * @private
   */
  #error = false;

  constructor(input: string) {
    this.#currentIndex = 0;
    this.#input = input;
  }

  /**
   * busca los condicionales en el input
   */
  parseConditionals(): EditorConditional[] | undefined {
    const conditionals = this.#seekConditionals();

    if (this.#error) {
      return undefined;
    } else {
      return conditionals;
    }
  }

  #seekConditionals(): EditorConditional[] {
    const conditionals: EditorConditional[] = [];

    while (this.#currentIndex < this.#input.length && !this.#error) {
      const conditional = new EditorConditional("", "", "");
      conditionals.push(conditional);

      this.#seekAndConditional(conditional);
    }

    return conditionals;
  }

  #seekAndConditional(conditional: EditorConditional) {
    this.#seekColumn(conditional);
    this.#seekOperator(conditional);
    this.#seekValue(conditional);
    this.#seekConnector(conditional);
  }

  #seekColumn(conditional: EditorConditional) {
    let operatorFound = false;
    let spaceFound = false;
    let column = '';

    while (!operatorFound) {
      const currentChar = this.#input.charAt(this.#currentIndex);

      if (currentChar === '=' || currentChar === '!' || currentChar === '<' || currentChar === '>') {
        operatorFound = true;
      } else if (currentChar === ' ') {
        // Ignorar espacios
        spaceFound = true;
        this.#currentIndex++;
      } else if (currentChar == "") {
        console.warn("End of stream");
        this.#error = true;
        return;
      } else {
        // Columna
        if (spaceFound) {
          console.warn("Space found between conditional column chunk.", this.#input);
          column += '_';
        }

        column += currentChar;
        this.#currentIndex++;
      }
    }

    conditional.column = column;
  }

  #seekOperator(conditional: EditorConditional) {
    let operator = "";

    const firstChar = this.#input.charAt(this.#currentIndex);
    const secondChar = this.#input.charAt(this.#currentIndex + 1);

    if (firstChar === "=" && secondChar === "=") {
      operator = "==";
      this.#currentIndex += 2;
    } else if (firstChar === "!" && secondChar === "=") {
      operator = "!=";
      this.#currentIndex += 2;
    } else if (firstChar === ">") {
      if (secondChar === "=") {
        operator = ">=";
        this.#currentIndex += 2;
      } else {
        operator = ">";
        this.#currentIndex += 1;
      }
    } else if (firstChar === "<") {
      if (secondChar === "=") {
        operator = "<=";
        this.#currentIndex += 2;
      } else {
        operator = "<";
        this.#currentIndex += 1;
      }
    } else {
      console.warn("Invalid operator found", this.#input);
      this.#error = true;
      return;
    }

    conditional.operator = operator;
  }

  #seekValue(conditional: EditorConditional) {
    let endFound = false;
    let isLiteral: boolean | undefined = undefined;

    let value = "";

    while (!endFound) {
      const currentChar = this.#input.charAt(this.#currentIndex);

      if (currentChar === "'") {
        if (isLiteral === undefined) {
          isLiteral = true;
        } else if (isLiteral) {
          endFound = true;
        } else {
          console.warn("Illegal \" in value.", this.#input);
          this.#error = true;
          return;
        }
      } else if (currentChar === "") {
        // Fin de cadena
        endFound = true;
      } else if (currentChar === " " && !isLiteral) {
        if (value !== "") {
          // Es un espacio de fin de valor
          endFound = true;
        }
      } else if ((currentChar === "&" || currentChar === "|") && !isLiteral) {
        // Es un espacio de fin de valor
        endFound = true;
      } else {
        if (isLiteral === undefined) {
          isLiteral = false;
        }

        value += currentChar;
      }

      this.#currentIndex++;
    }

    conditional.value = value;
  }

  #seekConnector(conditional: EditorConditional) {
    let endFound = false;
    let connector: undefined | "AND" | "OR";

    while (!endFound) {
      const currentChar = this.#input.charAt(this.#currentIndex);

      if (currentChar === " ") {
        // Ignorar espacio
        this.#currentIndex++;
      } else if (currentChar === "&") {
        connector = "AND";
        this.#currentIndex++;
      } else if (currentChar === "|") {
        connector = "OR";
        this.#currentIndex++;
      } else if (connector !== undefined) {
        endFound = true;
      } else if (currentChar === "") {
        endFound = true;
        this.#currentIndex = this.#input.length;
      } else {
        console.warn("Illegal after-value: " + currentChar, this.#input)
        this.#error = true;
        return;
      }
    }

    if (connector === "AND") {
      conditional.next = new EditorConditional("", "", "");
      this.#seekAndConditional(conditional.next);
    }
  }


}
