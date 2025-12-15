type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipState {
  content: string;
  position: TooltipPosition;
  tooltipElement: HTMLDivElement | null;
}

interface ActionReturn {
  update?: (value: any) => void;
  destroy?: () => void;
}

const tooltipState = new WeakMap<HTMLElement, TooltipState>();

export function tooltip(element: HTMLElement, content: string): ActionReturn {
  let state = tooltipState.get(element);
  
  if (!state) {
    state = {
      content: '',
      position: 'top',
      tooltipElement: null
    };
    tooltipState.set(element, state);
  }

  state.content = content;

  function createTooltip(): void {
    if (!state) return;
    
    state.tooltipElement = document.createElement('div');
    state.tooltipElement.className = `tooltip tooltip-${state.position}`;
    state.tooltipElement.innerHTML = state.content;
    document.body.appendChild(state.tooltipElement);
  }

  function positionTooltip(): void {
    if (!state?.tooltipElement) return;

    const rect = element.getBoundingClientRect();
    const tooltipRect = state.tooltipElement.getBoundingClientRect();

    let top: number, left: number;

    switch (state.position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
    }

    state.tooltipElement.style.top = `${top + window.scrollY}px`;
    state.tooltipElement.style.left = `${left + window.scrollX}px`;
  }

  function showTooltip(): void {
    if (!state?.content) return;
    createTooltip();
    positionTooltip();
    setTimeout(() => {
      state?.tooltipElement?.classList.add('visible');
    }, 10);
  }

  function hideTooltip(): void {
    if (state?.tooltipElement) {
      state.tooltipElement.classList.remove('visible');
      setTimeout(() => {
        if (state?.tooltipElement?.parentNode) {
          document.body.removeChild(state.tooltipElement);
          state.tooltipElement = null;
        }
      }, 200);
    }
  }

  element.addEventListener('mouseenter', showTooltip);
  element.addEventListener('mouseleave', hideTooltip);

  return {
    update(newContent: string): void {
      if (!state) return;
      state.content = newContent;
      if (state.tooltipElement) {
        state.tooltipElement.innerHTML = newContent;
      }
    },
    destroy(): void {
      element.removeEventListener('mouseenter', showTooltip);
      element.removeEventListener('mouseleave', hideTooltip);
      hideTooltip();
      tooltipState.delete(element);
    }
  };
}

export function tooltipPosition(element: HTMLElement, position: TooltipPosition): ActionReturn {
  let state = tooltipState.get(element);
  
  if (!state) {
    state = {
      content: '',
      position: 'top',
      tooltipElement: null
    };
    tooltipState.set(element, state);
  }

  state.position = position;

  return {
    update(newPosition: TooltipPosition): void {
      if (!state) return;
      state.position = newPosition;
    }
  };
}