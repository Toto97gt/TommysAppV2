import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

import { AlertasService } from 'src/services/alertas.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-servicio-multimedia',
  templateUrl: './servicio-multimedia.page.html',
  styleUrls: ['./servicio-multimedia.page.scss'],
})
export class ServicioMultimediaPage implements OnInit {

  tipoProducto = 'ASEO';
  multimediaForm!: FormGroup;

  foto: any = null;
  video: any = null;
  servicio: any = null;

  constructor(
    private navController: NavController,
    private form: FormBuilder,
    private sanitizer: DomSanitizer,
    private multimediaService: MultimediaService,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private restApiService: RestApiService
  ) {}

  async ngOnInit() {
    this.multimediaForm = this.form.group({ mensaje: [''] });

    // Servicio actual
    this.servicio = await this.storageService.getItemObject('servicio');

    // Foto almacenada (si existe)
    const foto = await this.storageService.getItemObject('foto');
    if (foto) {
      const display = this.toDisplayUrl(foto.url || foto.nativeURL || foto.path || foto.webPath);
      this.foto = {
        ...foto,
        urlFileSrc: display,
        idServicio: this.servicio?.id,
      };
    }

    // Video almacenado (si existe)
    const video = await this.storageService.getItemObject('video');
    if (video) {
      const display = this.toDisplayUrl(video.url || video.nativeURL || video.path || video.webPath);
      this.video = {
        ...video,
        urlFileSrc: display,
        idServicio: this.servicio?.id,
      };
    }

    // Tipo producto (ASEO/PASEO/BANIO)
    const tipoProducto = await this.storageService.getItem('tipoProducto');
    if (tipoProducto) this.tipoProducto = tipoProducto;
  }

  async enviar() {
    this.alertasService.presentLoading('');

    // Adjunta mensaje y tipo al objeto (como antes)
    const msg = this.multimediaForm.get('mensaje')?.value ?? null;
    if (this.foto) {
      this.foto.mensaje = msg;
      this.foto.tipoProducto = this.tipoProducto;
    }
    if (this.video) {
      this.video.mensaje = msg;
      this.video.tipoProducto = this.tipoProducto;
    }

    try {
      const respuesta: any = await this.subirArchivo();
      this.alertaEnviar(respuesta?.mensaje ?? 'Operación finalizada.', !!respuesta?.exitoso);
    } catch {
      this.alertaEnviar('No se pudo subir el archivo.', false);
    } finally {
      this.alertasService.dismissLoading();
    }
  }

  /** Sube foto o video (el que exista) como FormData */
  private async subirArchivo(): Promise<any> {
    const datos = this.foto ?? this.video;
    if (!datos) {
      throw new Error('No hay archivo para subir');
    }

    // Nombre y extensión
    const fileName: string =
      datos.nombreLocal || datos.nombre || this.intentarNombreDesdeRuta(datos.url) || 'archivo.bin';
    const extension: string =
      datos.extension || this.intentarExtension(fileName) || 'bin';

    // Blob del archivo
    const blob = await this.obtenerBlob(datos, extension);

    const formData = new FormData();
    formData.append('archivo', blob, fileName);
    formData.append('extension', extension);
    formData.append('datos', JSON.stringify(datos));

    // Mantengo tu endpoint y servicio
    return this.restApiService.postFileApi('multimedia/agregar', formData);
  }

  // =========================
  // Helpers de archivo / URL
  // =========================

  /** Construye una URL visible en el WebView y la marca como segura */
  private toDisplayUrl(raw?: string): SafeResourceUrl | null {
    if (!raw) return null;
    try {
      const converted = Capacitor.convertFileSrc(raw);
      return this.sanitizer.bypassSecurityTrustResourceUrl(converted);
    } catch {
      return null;
    }
  }

  /** Intenta leer un Blob:
   *  - Si viene base64 en el objeto (ej: de Camera), crea Blob desde base64.
   *  - Si hay ruta local (file:// o filesystem://), hace fetch del convertFileSrc.
   */
  private async obtenerBlob(datos: any, extensionFallback: string): Promise<Blob> {
    // 1) Base64 directo
    if (datos.base64) {
      const contentType = this.mimePorExtension(this.intentarExtension(datos.nombreLocal || datos.nombre) || extensionFallback);
      return this.base64ToBlob(datos.base64, contentType);
    }

    // 2) Ruta local (file://, content://, filesystem://)
    const path: string | undefined = datos.url || datos.nativeURL || datos.path || datos.webPath;
    if (path) {
      const webUrl = Capacitor.convertFileSrc(path);
      const resp = await fetch(webUrl);
      if (!resp.ok) throw new Error('No se pudo leer el archivo local');
      return await resp.blob();
    }

    throw new Error('No se encontró origen de archivo');
  }

  private base64ToBlob(base64: string, contentType = 'application/octet-stream'): Blob {
    // base64 sin encabezado data:; si viene con encabezado, córtalo
    const clean = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteChars = atob(clean);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  private intentarNombreDesdeRuta(ruta?: string): string | null {
    if (!ruta) return null;
    try {
      const decoded = decodeURIComponent(ruta);
      const m = decoded.match(/[^/\\]+$/);
      return m ? m[0] : null;
    } catch {
      return null;
    }
  }

  private intentarExtension(nombre?: string): string | null {
    if (!nombre) return null;
    const idx = nombre.lastIndexOf('.');
    return idx >= 0 ? nombre.substring(idx + 1).toLowerCase() : null;
    }

  private mimePorExtension(ext?: string): string {
    switch ((ext || '').toLowerCase()) {
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'mp4': return 'video/mp4';
      case 'mov': return 'video/quicktime';
      case 'webm': return 'video/webm';
      default: return 'application/octet-stream';
    }
  }

  // =========================
  // Alertas / navegación
  // =========================

  private alertaEnviar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: 'Agregar Multimedia',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              this.navController.navigateBack('/servicio-detalle');
            } else {
              // sin acción extra
            }
          }
        }
      ]
    };
    this.alertasService.presentarAlerta(opciones);
  }
}
