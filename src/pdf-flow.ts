/* ===== pdf-flow.ts — 3-step workflow stepper for PDF tools =====
 *
 * Standardises every PDF tool around the same Upload → Configure → Download
 * pattern. Tools auto-discover the stepper by including the markup pattern
 * below; no per-tool wiring needed beyond calling PDFFlow.advance().
 *
 *   <ol class="pdf-flow" data-pdf-flow>
 *     <li class="pdf-flow-step active" data-step="upload">Upload</li>
 *     <li class="pdf-flow-step"        data-step="configure">Configure</li>
 *     <li class="pdf-flow-step"        data-step="download">Download</li>
 *   </ol>
 *
 *   PDFFlow.advance('configure');  // mark upload done, configure active
 *   PDFFlow.advance('download');   // mark configure done, download active
 *   PDFFlow.reset();               // back to upload
 */

(function () {
  type StepName = string;

  interface FlowController {
    setStep(name: StepName): void;
    advance(toName: StepName): void;
    reset(): void;
    currentStep(): StepName | null;
  }

  function controllerFor(root: HTMLElement): FlowController {
    const stepNodes = Array.from(root.querySelectorAll<HTMLElement>('.pdf-flow-step'));

    function indexOf(name: StepName): number {
      return stepNodes.findIndex(n => n.dataset.step === name);
    }

    function paint(activeIdx: number): void {
      stepNodes.forEach((node, idx) => {
        node.classList.toggle('active', idx === activeIdx);
        node.classList.toggle('done', idx < activeIdx);
        if (idx === activeIdx) {
          node.setAttribute('aria-current', 'step');
        } else {
          node.removeAttribute('aria-current');
        }
      });
    }

    function setStep(name: StepName): void {
      const i = indexOf(name);
      if (i < 0) return;
      paint(i);
    }

    function advance(name: StepName): void {
      const i = indexOf(name);
      if (i < 0) return;
      paint(i);
    }

    function reset(): void {
      paint(0);
    }

    function currentStep(): StepName | null {
      const node = stepNodes.find(n => n.classList.contains('active'));
      return node?.dataset.step ?? null;
    }

    // Initial paint based on existing markup
    const initialActive = stepNodes.findIndex(n => n.classList.contains('active'));
    paint(initialActive < 0 ? 0 : initialActive);

    return { setStep, advance, reset, currentStep };
  }

  const controllers = new WeakMap<HTMLElement, FlowController>();

  function find(selector?: string): FlowController | null {
    const root = (selector
      ? document.querySelector<HTMLElement>(selector)
      : document.querySelector<HTMLElement>('[data-pdf-flow]'));
    if (!root) return null;
    let ctrl = controllers.get(root);
    if (!ctrl) {
      ctrl = controllerFor(root);
      controllers.set(root, ctrl);
    }
    return ctrl;
  }

  // Auto-init any present steppers on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll<HTMLElement>('[data-pdf-flow]').forEach(el => {
      if (!controllers.has(el)) controllers.set(el, controllerFor(el));
    });
  });

  (window as Window & { PDFFlow?: unknown }).PDFFlow = {
    setStep(name: StepName, selector?: string) { find(selector)?.setStep(name); },
    advance(name: StepName, selector?: string) { find(selector)?.advance(name); },
    reset(selector?: string) { find(selector)?.reset(); },
    currentStep(selector?: string) { return find(selector)?.currentStep() ?? null; },
  };
})();
