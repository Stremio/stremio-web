function disableShortcuts() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'u')
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });
}

function detectDevTools(onDetect = () => {}) {
  let last = new Date().getTime();
  setInterval(() => {
    const t0 = new Date().getTime();
    debugger;
    const t1 = new Date().getTime();
    if (t1 - t0 > 100) {
      onDetect();
    }
    last = t1;
  }, 1000);
}

export function initAntiInspect() {
  try {
    disableShortcuts();
    detectDevTools(() => {
      console.warn('Developer tools detected — reloading page.');
      window.location.reload();
    });
  } catch (e) {
    // fail silently
  }
}
