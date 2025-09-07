import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem } from '@capacitor/filesystem';
import { PushNotifications } from '@capacitor/push-notifications';

export type EstadoPermisos = 'ninguno' | 'solicitando' | 'correcto' | 'rechazado';
export type PermKind = 'geolocation' | 'filesystem' | 'push';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  // Estado "global" (compatibilidad con tu API actual)
  private estadoPermisos: EstadoPermisos = 'ninguno';

  // Estado por permiso (nuevo)
  private estados = new Map<PermKind, EstadoPermisos>([
    ['geolocation', 'ninguno'],
    ['filesystem',  'ninguno'],
    ['push',        'ninguno'],
  ]);

  constructor() {}

  // ---------- NUEVO: API genérica por permiso ----------
  getState(kind: PermKind): EstadoPermisos {
    return this.estados.get(kind) ?? 'ninguno';
  }

  private setState(kind: PermKind, s: EstadoPermisos) {
    this.estados.set(kind, s);
  }

  /**
   * Pide un permiso específico y devuelve su estado
   * Uso: await request('filesystem' | 'geolocation' | 'push')
   */
  async request(kind: PermKind): Promise<EstadoPermisos> {
    // evita pedir varias veces simultáneamente
    const current = this.getState(kind);
    if (current === 'solicitando') {
      await this.wait(500); // backoff corto
      return this.getState(kind);
    }

    this.setState(kind, 'solicitando');
    try {
      switch (kind) {
        case 'geolocation': {
          // En iOS/Android esto muestra prompt si no está concedido aún
          await Geolocation.requestPermissions(); // si no lanza, asumimos correcto
          this.setState(kind, 'correcto');
          break;
        }
        case 'filesystem': {
          // En muchas plataformas es no-op (sandbox). Si no lanza error, lo marcamos correcto.
          const r: any = await Filesystem.requestPermissions().catch(() => undefined);
          const ok = r?.publicStorage ? r.publicStorage === 'granted' : true;
          this.setState(kind, ok ? 'correcto' : 'rechazado');
          break;
        }
        case 'push': {
          const r = await PushNotifications.requestPermissions(); // { receive: 'granted' | 'denied' }
          this.setState(kind, r.receive === 'granted' ? 'correcto' : 'rechazado');
          break;
        }
      }
    } catch (e) {
      console.error(`Permiso ${kind} denegado/error`, e);
      this.setState(kind, 'rechazado');
    }
    return this.getState(kind);
  }

  // ---------- COMPAT: tu API actual se mantiene ----------
  async getPermisosCorrectos(): Promise<boolean> {
    if (this.estadoPermisos === 'ninguno') {
      this.estadoPermisos = 'solicitando';
      const granted = await this.solicitarPermisos();
      this.estadoPermisos = granted ? 'correcto' : 'rechazado';
      return granted;

    } else if (this.estadoPermisos === 'solicitando') {
      await this.wait(10 * 1000);
      return (this.estadoPermisos as EstadoPermisos) === 'correcto';

    } else if (this.estadoPermisos === 'correcto') {
      return true;

    } else {
      return false;
    }
  }

  /** 🔑 Pide los permisos que realmente usas (tu flujo global actual) */
  private async solicitarPermisos(): Promise<boolean> {
    const ubicacion = await this.solicitarPermisosUbicacion();
    const archivos  = await this.solicitarPermisosArchivos();
    // Si también quieres push aquí, descomenta:
    // const push = await this.solicitarPermisosPush();
    // return ubicacion && archivos && push;
    return ubicacion && archivos;
  }

  async solicitarPermisosUbicacion(): Promise<boolean> {
    try {
      await Geolocation.requestPermissions();
      this.setState('geolocation', 'correcto');
      return true;
    } catch (err) {
      console.error('Permiso ubicación denegado', err);
      this.setState('geolocation', 'rechazado');
      return false;
    }
  }

  async solicitarPermisosArchivos(): Promise<boolean> {
    try {
      const r: any = await Filesystem.requestPermissions().catch(() => undefined);
      const ok = r?.publicStorage ? r.publicStorage === 'granted' : true;
      this.setState('filesystem', ok ? 'correcto' : 'rechazado');
      return ok;
    } catch (err) {
      console.error('Permiso archivos denegado', err);
      this.setState('filesystem', 'rechazado');
      return false;
    }
  }

  // ---- Opcional: push (si usas notificaciones) ----
  async solicitarPermisosPush(): Promise<boolean> {
    try {
      const r = await PushNotifications.requestPermissions();
      const ok = r.receive === 'granted';
      this.setState('push', ok ? 'correcto' : 'rechazado');
      return ok;
    } catch (err) {
      console.error('Permiso push denegado', err);
      this.setState('push', 'rechazado');
      return false;
    }
  }

  // ---- Alias de compatibilidad con tu MultimediaService viejo ----
  async solicitarPermisoEscritura(): Promise<boolean> {
    return this.solicitarPermisosArchivos();
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}