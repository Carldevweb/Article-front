import { HttpErrorResponse } from '@angular/common/http';

export function getBackendMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const apiMsg = (err.error as any)?.message;
    if (typeof apiMsg === 'string' && apiMsg.trim()) {
      return apiMsg;
    }

    if (err.status === 0) return 'Backend inaccessible (serveur arrêté ou CORS).';
    if (err.status === 400) return 'Requête invalide.';
    if (err.status === 401) return 'Identifiants incorrects.';
    if (err.status === 403) return 'Accès refusé.';
    if (err.status === 409) return 'Email déjà utilisé.';
  }

  return fallback;
}
