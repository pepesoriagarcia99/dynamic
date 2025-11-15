class Table extends HTMLElement {
  static get observedAttributes() {
    return ['mensaje'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) this.render();
  }

  private render() {
    const mensaje = this.getAttribute('mensaje') || '¡Hola desde TS!';
    this.shadowRoot!.innerHTML = `
      <style>
        p { color: darkred; font-weight: bold; }
      </style>
      <p>${mensaje}</p>
    `;
  }
}
