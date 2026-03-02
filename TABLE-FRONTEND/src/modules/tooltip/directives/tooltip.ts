import type { Attachment } from 'svelte/attachments';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipOptions {
  value: string;
  position?: TooltipPosition;
  delay?: number;
}

export function tooltip(value: string | TooltipOptions): Attachment<HTMLElement> {
  const options: TooltipOptions = typeof value === 'string'
    ? { value, position: 'top', delay: 0 }
    : { position: 'top', delay: 0, ...value };

  return (element: HTMLElement) => {
    let tooltipElement: HTMLDivElement | null = null;
    let timeoutId: number | null = null;

    function createTooltip(): void {
      tooltipElement = document.createElement('div');
      tooltipElement.className = `tooltip tooltip-${options.position}`;
      tooltipElement.innerHTML = options.value;
      document.body.appendChild(tooltipElement);
    }

    function positionTooltip(): void {
      if (!tooltipElement) return;

      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltipElement.getBoundingClientRect();

      let top: number, left: number;

      switch (options.position) {
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

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8;

      if (left < margin) {
        left = margin;
      } else if (left + tooltipRect.width > viewportWidth - margin) {
        left = viewportWidth - tooltipRect.width - margin;
      }

      if (top < margin) {
        top = margin;
      } else if (top + tooltipRect.height > viewportHeight - margin) {
        top = viewportHeight - tooltipRect.height - margin;
      }

      tooltipElement.style.top = `${top + window.scrollY}px`;
      tooltipElement.style.left = `${left + window.scrollX}px`;
    }

    function showTooltip(): void {
      if (!options.value) return;

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        createTooltip();
        positionTooltip();
        setTimeout(() => {
          tooltipElement?.classList.add('visible');
        }, 10);
      }, options.delay);
    }

    function hideTooltip(): void {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (tooltipElement) {
        tooltipElement.classList.remove('visible');
        const el = tooltipElement;
        tooltipElement = null;
        setTimeout(() => {
          if (el.parentNode) {
            document.body.removeChild(el);
          }
        }, 200);
      }
    }

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      element.removeEventListener('mouseenter', showTooltip);
      element.removeEventListener('mouseleave', hideTooltip);
      hideTooltip();
    };
  };
}