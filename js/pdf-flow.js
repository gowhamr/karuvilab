(function() {
  function controllerFor(root) {
    const stepNodes = Array.from(root.querySelectorAll(".pdf-flow-step"));
    function indexOf(name) {
      return stepNodes.findIndex((n) => n.dataset.step === name);
    }
    function paint(activeIdx) {
      stepNodes.forEach((node, idx) => {
        node.classList.toggle("active", idx === activeIdx);
        node.classList.toggle("done", idx < activeIdx);
        if (idx === activeIdx) {
          node.setAttribute("aria-current", "step");
        } else {
          node.removeAttribute("aria-current");
        }
      });
    }
    function setStep(name) {
      const i = indexOf(name);
      if (i < 0) return;
      paint(i);
    }
    function advance(name) {
      const i = indexOf(name);
      if (i < 0) return;
      paint(i);
    }
    function reset() {
      paint(0);
    }
    function currentStep() {
      const node = stepNodes.find((n) => n.classList.contains("active"));
      return node?.dataset.step ?? null;
    }
    const initialActive = stepNodes.findIndex((n) => n.classList.contains("active"));
    paint(initialActive < 0 ? 0 : initialActive);
    return { setStep, advance, reset, currentStep };
  }
  const controllers = /* @__PURE__ */ new WeakMap();
  function find(selector) {
    const root = selector ? document.querySelector(selector) : document.querySelector("[data-pdf-flow]");
    if (!root) return null;
    let ctrl = controllers.get(root);
    if (!ctrl) {
      ctrl = controllerFor(root);
      controllers.set(root, ctrl);
    }
    return ctrl;
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-pdf-flow]").forEach((el) => {
      if (!controllers.has(el)) controllers.set(el, controllerFor(el));
    });
  });
  window.PDFFlow = {
    setStep(name, selector) {
      find(selector)?.setStep(name);
    },
    advance(name, selector) {
      find(selector)?.advance(name);
    },
    reset(selector) {
      find(selector)?.reset();
    },
    currentStep(selector) {
      return find(selector)?.currentStep() ?? null;
    }
  };
})();
