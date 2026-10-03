export class ApplicationService {
  async reloadApplication(): Promise<void> {
    console.log('Désinscriptions...', navigator.serviceWorker);

    const cacheDeletions = await this.clearCaches();
    console.log('Deleted caches : ', cacheDeletions);

    const unregistrations = await this.unregisterServiceWorker();
    console.log('Unregistrations : ', unregistrations);

    window.location.href =
      window.location.pathname + '?reload=' + new Date().toISOString();
  }

  async clearCaches(): Promise<boolean[]> {
    const cacheNames = await window.caches.keys();
    return await Promise.all(
      cacheNames.map((cacheName) => {
        console.log('Clearing cache : ', cacheName);
        return caches.delete(cacheName);
      })
    );
  }

  async unregisterServiceWorker(): Promise<boolean[]> {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return Promise.all(
      registrations.map((registration) => registration.unregister())
    );
  }
}

export const applicationService = new ApplicationService();
