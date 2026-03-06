import { FormState } from './FormState';

/**
 * Patron mediator
 * 
 * El mediador permite sincronizarse con los cambios de estado del formulario
 */

type FormStateListener = (state: FormState) => void;

export class FormStateNotifier {
  private listeners = new Set<FormStateListener>();
  private last?: FormState;

  constructor(initialState?: FormState) {
    if (initialState) this.last = initialState;
  }

  subscribe(listener: FormStateListener): () => void {
    this.listeners.add(listener);

    if (this.last) listener(this.last);
    return () => this.listeners.delete(listener);
  }

  unsubscribe(listener: FormStateListener): void {
    this.listeners.delete(listener);
  }

  emit(state: FormState): void {
    this.last = state;
    for (const l of this.listeners) l(state);
  }
}
