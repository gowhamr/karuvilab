/**
 * Live-region announcement utilities for screen readers.
 */
export const announce = (message, politeness = "polite") => {
    const containerId = `a11y-announcer-${politeness}`;
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.setAttribute("aria-live", politeness);
        container.setAttribute("aria-atomic", "true");
        container.style.position = "absolute";
        container.style.width = "1px";
        container.style.height = "1px";
        container.style.padding = "0";
        container.style.margin = "-1px";
        container.style.overflow = "hidden";
        container.style.clip = "rect(0, 0, 0, 0)";
        container.style.whiteSpace = "nowrap";
        container.style.border = "0";
        document.body.appendChild(container);
    }
    // Brief delay to ensure screen readers register the change
    setTimeout(() => {
        if (container) {
            container.textContent = message;
            // Clear after read to allow repeating the same message later
            setTimeout(() => {
                container.textContent = "";
            }, 1000);
        }
    }, 50);
};
