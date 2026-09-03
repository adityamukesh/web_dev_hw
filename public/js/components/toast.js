// toast.js - Toast Notification Engine
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full';
      document.body.appendChild(container);
    }
    this.container = container;
  }

  show({ message, type = 'info', duration = 3500, title = null }) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-4 opacity-0 flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md text-sm font-medium ${this.getThemeClasses(type)}`;

    const iconSvg = this.getIcon(type);

    toast.innerHTML = `
      <div class="flex-shrink-0 mt-0.5">${iconSvg}</div>
      <div class="flex-1 min-w-0">
        ${title ? `<p class="font-bold text-xs uppercase tracking-wider mb-0.5 opacity-90">${title}</p>` : ''}
        <p class="leading-snug">${message}</p>
      </div>
      <button class="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-1 -mr-1 -mt-1 rounded">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    // Close button
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
  }

  dismiss(toast) {
    if (!toast || !toast.parentElement) return;
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }

  success(message, title = 'Success') {
    this.show({ message, type: 'success', title });
  }

  error(message, title = 'Error') {
    this.show({ message, type: 'error', title, duration: 5000 });
  }

  info(message, title = 'Notice') {
    this.show({ message, type: 'info', title });
  }

  warning(message, title = 'Warning') {
    this.show({ message, type: 'warning', title });
  }

  getThemeClasses(type) {
    switch (type) {
      case 'success':
        return 'bg-emerald-950/90 text-emerald-100 border-emerald-800 shadow-emerald-950/40 dark:bg-emerald-900/90 dark:border-emerald-700';
      case 'error':
        return 'bg-rose-950/90 text-rose-100 border-rose-800 shadow-rose-950/40 dark:bg-rose-900/90 dark:border-rose-700';
      case 'warning':
        return 'bg-amber-950/90 text-amber-100 border-amber-800 shadow-amber-950/40 dark:bg-amber-900/90 dark:border-amber-700';
      case 'info':
      default:
        return 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/40 dark:bg-slate-800/95 dark:border-slate-600';
    }
  }

  getIcon(type) {
    switch (type) {
      case 'success':
        return '<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      case 'error':
        return '<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      case 'warning':
        return '<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      case 'info':
      default:
        return '<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
  }
}

window.toast = new ToastManager();
