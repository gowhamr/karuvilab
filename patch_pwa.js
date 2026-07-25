const fs = require('fs');
const path = 'components/PWARegistration.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove automatic popup logic
const autoPopupLogic = `
    // Rule: Show after 2nd visit immediately, OR 30 seconds into first visit
    if (currentVisits >= 2) {
      Promise.resolve().then(() => {
        setShowPrompt(true);
      });
    } else {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30s engagement
      return () => clearTimeout(timer);
    }
`;
content = content.replace(autoPopupLogic, `
    // User requested to disable automatic PWA popup.
    // It will now only be triggered manually from the Settings page.
`);

// 2. Fix the disabled button issue for Brave/Opera (fallback UI)
const oldNativeAction = `
          // Native PWA Install Action
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              disabled={!deferredPrompt}
              aria-label="Install KaruviLab app"
              className="flex-1 py-2.5 bg-blue hover:bg-blue/90 disabled:opacity-50 text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm transition-all active:scale-95 shadow-md shadow-blue/10"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 bg-bg border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:text-text hover:bg-mat-hover transition-all"
            >
              Not now
            </button>
          </div>
`;

const newNativeAction = `
          // Native PWA Install Action or Fallback for Brave/Opera
          <div className="space-y-3">
            {!deferredPrompt && !isIOS && !isSafari ? (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-text-2">
                <p className="font-bold text-error mb-1">Automatic install blocked</p>
                <p>Your browser (like Brave, Opera, or Firefox) blocks automatic installation. To install, look for the <strong>Install</strong> icon in your URL address bar or open the browser menu (⋮) and select <strong>Install App</strong>.</p>
              </div>
            ) : null}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                disabled={!deferredPrompt}
                aria-label="Install KaruviLab app"
                className="flex-1 py-2.5 bg-blue hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm transition-all active:scale-95 shadow-md shadow-blue/10"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 bg-bg border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:text-text hover:bg-mat-hover transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
`;

content = content.replace(oldNativeAction.trim(), newNativeAction.trim());

fs.writeFileSync(path, content);
console.log("Patched PWARegistration.tsx");
