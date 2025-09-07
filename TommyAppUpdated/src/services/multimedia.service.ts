import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { v4 } from 'uuid';

import { Camera, CameraResultType, CameraSource, GalleryImageOptions } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { VideoRecorder } from '@capacitor-community/video-recorder';
import { FilePicker, PickMediaResult, PickedFile } from '@capawesome/capacitor-file-picker';

import { PermissionService } from 'src/services/permission.service';
import { NetworkService, ConnectionStatus } from './network.service';

@Injectable({ providedIn: 'root' })
export class MultimediaService {

  constructor(
    private sanitizer: DomSanitizer,
    private networkService: NetworkService,
    private permissionService: PermissionService
  ) {}

  // ---------------------------
  // FOTOS
  // ---------------------------

  /** Captura foto (camera) y la guarda como archivo local + retorna base64 */
  async capturarFotoBlob(): Promise<{
    nombre: string;
    url: string;          // uri nativa (filesystem://...)
    displayUrl: any;      // sanitizer SafeResourceUrl (convertFileSrc)
    base64: string;
  } | null> {
    try {
      await this.permissionService.getPermisosCorrectos();
      const photo = await Camera.getPhoto({
        quality: 50,
        correctOrientation: true,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
        saveToGallery: false
      });

      if (!photo.base64String) return null;

      const nombreFoto = `${v4()}.jpg`;
      const write = await Filesystem.writeFile({
        path: nombreFoto,
        data: photo.base64String,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });

      const displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        Capacitor.convertFileSrc(write.uri)
      );

      return {
        nombre: nombreFoto,
        url: write.uri,
        displayUrl,
        base64: photo.base64String
      };
    } catch (e) {
      console.error('Error capturarFotoBlob:', e);
      return null;
    }
  }

  /** Captura foto y retorna solo URL (sin base64) */
  async capturarFotoUrl(): Promise<{
    url: string;          // filesystem://...
    displayUrl: any;      // SafeResourceUrl
    nombreLocal: string;
    rutaLocal: string;
    extension: string;
  } | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 50,
        correctOrientation: true,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        saveToGallery: true
      });

      //const uri = photo.path || photo.webPath || photo.saveToGallery ? (photo.path ?? photo.webPath!) : photo.webPath!;
      const uri = photo.path ?? photo.webPath ?? '';
      if (!uri) return null;

      const nombre = this.extraerNombre(uri);
      const ruta = this.extraerRuta(uri);
      const extension = this.extraerExtension(nombre);

      const displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        Capacitor.convertFileSrc(uri)
      );

      return {
        url: uri,
        displayUrl,
        nombreLocal: nombre,
        rutaLocal: ruta,
        extension
      };
    } catch (e) {
      console.error('Error capturarFotoUrl:', e);
      return null;
    }
  }

  /** Selecciona foto de galería y la guarda + retorna base64 */
  async galeriaFotoBlob(): Promise<{
    nombre: string;
    url: string;
    displayUrl: any;
    base64: string;
  } | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.Base64
      });

      if (!photo.base64String) return null;

      const nombreFoto = `${v4()}.jpg`;
      const write = await Filesystem.writeFile({
        path: nombreFoto,
        data: photo.base64String,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });

      const displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        Capacitor.convertFileSrc(write.uri)
      );

      return {
        nombre: nombreFoto,
        url: write.uri,
        displayUrl,
        base64: photo.base64String
      };
    } catch (e) {
      console.error('Error galeriaFotoBlob:', e);
      return null;
    }
  }

  /** Selecciona foto y retorna URL */
  async galeriaFotoUrl(): Promise<{
    url: string;
    displayUrl: any;
    nombreLocal: string;
    rutaLocal: string;
    extension: string;
  } | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.Uri
      });

      const uri = photo.path || photo.webPath!;
      if (!uri) return null;

      const nombre = this.extraerNombre(uri);
      const ruta = this.extraerRuta(uri);
      const extension = this.extraerExtension(nombre);

      const displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        Capacitor.convertFileSrc(uri)
      );

      return { url: uri, displayUrl, nombreLocal: nombre, rutaLocal: ruta, extension };
    } catch (e) {
      console.error('Error galeriaFotoUrl:', e);
      return null;
    }
  }

  // ---------------------------
  // VIDEO
  // ---------------------------

  /** Graba un video (usa @capacitor-community/video-recorder) y retorna URL local */
  async capturarVideoUrl(): Promise<{
    url: string;          // file://... o content://...
    displayUrl: any;
    nombreLocal: string;
    rutaLocal: string;
    extension: string;
  } | null> {
    try {
      await this.permissionService.request('filesystem');
      // Inicializa cámara (opcional ajustar quality/resolución)
      await VideoRecorder.initialize({
        quality: 1, // MAX_720P; ver enum en docs
        autoShow: true
      });
      await VideoRecorder.startRecording();
      // Aquí puedes mostrar UI y luego detener según tu flujo
      const { videoUrl } = await VideoRecorder.stopRecording();

      if (!videoUrl) return null;

      const nombre = this.extraerNombre(videoUrl);
      const ruta = this.extraerRuta(videoUrl);
      const extension = this.extraerExtension(nombre);

      const displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        Capacitor.convertFileSrc(videoUrl)
      );

      return { url: videoUrl, displayUrl, nombreLocal: nombre, rutaLocal: ruta, extension };
    } catch (e) {
      console.error('Error capturarVideoUrl:', e);
      return null;
    } finally {
      try { await VideoRecorder.destroy(); } catch {}
    }
  }

  /** Selecciona video(s) desde galería */
  async galeriaVideoUrl(): Promise<{
    url: string;
    displayUrl: any;
    nombreLocal: string;
    rutaLocal: string;
    extension: string;
  } | null> {
    try {
        // ❌ multiple -> ✅ limit
        const res: PickMediaResult = await FilePicker.pickVideos({ limit: 1 });
        if (!res?.files?.length) return null;

        const file: PickedFile = res.files[0];

        // En Android/iOS tendrás file.path; en Web, blob.
        let uri: string;
        let displayUrl: any;

        if (file.path) {
        uri = file.path; // nativo
        displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            Capacitor.convertFileSrc(file.path)
        );
        } else if (file.blob) {
        // Web: crea un object URL para previsualizar
        uri = URL.createObjectURL(file.blob);
        displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(uri);
        } else {
        return null;
        }

        const nombre = file.name ?? this.extraerNombre(uri);
        const ruta = this.extraerRuta(uri);
        const extension = this.extraerExtension(nombre);

        return { url: uri, displayUrl, nombreLocal: nombre, rutaLocal: ruta, extension };
    } catch (e) {
        console.error('Error galeriaVideoUrl:', e);
        return null;
    }
  }

  // ---------------------------
  // ARCHIVOS
  // ---------------------------

  /** Elimina archivo local por URI (filesystem://... o file://...) */
  async eliminarArchivoLocal(urlLocal: string): Promise<boolean> {
    try {
      const { path, directory } = await this.normalizarRuta(urlLocal);
      await Filesystem.deleteFile({ path, directory });
      return true;
    } catch (e) {
      console.warn('No se pudo eliminar archivo', urlLocal, e);
      return false;
    }
  }

  /** Verifica si existe un archivo en el sandbox de la app (por nombre) */
  async existeArchivo(urlArchivo: string): Promise<{
    existe: boolean;
    url?: string;
    urlSafe?: any;
    nativeURL?: string;
  }> {
    try {
      const nombre = this.extraerNombre(urlArchivo);
      const stat = await Filesystem.stat({ path: nombre, directory: Directory.Data });
      const display = Capacitor.convertFileSrc(stat.uri);
      const isMp4 = nombre.toLowerCase().endsWith('.mp4');

      return {
        existe: true,
        url: isMp4 ? `${display}#t=0.1` : display,
        urlSafe: this.sanitizer.bypassSecurityTrustResourceUrl(isMp4 ? `${display}#t=0.1` : display),
        nativeURL: stat.uri
      };
    } catch {
      return { existe: false, url: urlArchivo };
    }
  }

  /** Descarga un archivo (con HttpClient en tu RestApiService) y lo guarda en sandbox */
  async descargar(urlArchivo: string): Promise<{
    exitoso: boolean;
    mensaje: string;
    url?: string;
    urlSafe?: any;
    nativeURL?: string;
  }> {
    try {
      if (this.networkService.getCurrentNetworkStatus() !== ConnectionStatus.Online) {
        return { exitoso: false, mensaje: 'No existe conexión!' };
      }

      // Obtén el blob con tu RestApiService/HttpClient (inyéctalo si prefieres) y pásalo aquí.
      const resp = await fetch(urlArchivo);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const blob = await resp.blob();

      const nombre = this.extraerNombre(urlArchivo) || `${v4()}`;
      const base64 = await this.blobToBase64(blob);

      const write = await Filesystem.writeFile({
        path: nombre,
        data: base64,
        directory: Directory.Data
      });

      const display = Capacitor.convertFileSrc(write.uri);

      return {
        exitoso: true,
        mensaje: 'Archivo descargado exitosamente.',
        url: display,
        urlSafe: this.sanitizer.bypassSecurityTrustResourceUrl(display),
        nativeURL: write.uri
      };
    } catch (e) {
      console.error('Error al descargar multimedia', e);
      return { exitoso: false, mensaje: 'Error al descargar multimedia.' };
    }
  }

  // ---------------------------
  // HELPERS
  // ---------------------------

  private extraerNombre(uri: string): string {
    const decoded = decodeURIComponent(uri);
    const m = decoded.match(/[^/\\]+$/);
    return m ? m[0] : decoded;
    // ej: file:///.../DCIM/Camera/VID_1234.mp4 -> VID_1234.mp4
  }

  private extraerRuta(uri: string): string {
    const decoded = decodeURIComponent(uri);
    return decoded.replace(/[^/\\]+$/, '');
  }

  private extraerExtension(nombre: string): string {
    const parts = nombre.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  /** Convierte URI (file://, content://, filesystem://) a { path, directory } para Filesystem */
  private async normalizarRuta(uri: string): Promise<{ path: string; directory: Directory }> {
    // Si el archivo fue guardado con Filesystem en Directory.Data, basta con extraer el nombre
    const nombre = this.extraerNombre(uri);
    return { path: nombre, directory: Directory.Data };
  }
}