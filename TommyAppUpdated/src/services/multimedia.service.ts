import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import { TranscodeOptions, VideoEditor } from '@ionic-native/video-editor/ngx';
import { PermissionService } from 'src/services/permission.service';
import { v4 } from 'uuid';
import { ConnectionStatus, NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
})
export class MultimediaService {

    constructor(
        private mediaCapture: MediaCapture,
        private videoEditor: VideoEditor,
        private camera: Camera,
        private file: File,
        private transfer: FileTransfer,
        private sanitizer: DomSanitizer,
        private networkService: NetworkService,
        private permissionService: PermissionService
    ) { }

    capturarFotoBlob() {
        return new Promise(resolve => {
            let options: CameraOptions = {
                quality: 50,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                correctOrientation: true,
                allowEdit: false
            };

            this.camera.getPicture(options).then((imageData: string) => {
                let imageBlob = this.b64toBlob(imageData, 'image/jpeg');
                let nombreFoto = v4() + '.jpg';

                this.file.writeFile(this.file.dataDirectory, nombreFoto, imageBlob).then(response => {
                    let foto = {
                        nombre: nombreFoto,
                        url: this.file.dataDirectory + nombreFoto,
                        base64: imageData
                    }
                    
                    console.log('Captura de foto:', foto.url);

                    resolve(foto);
                }).catch(error => {
                    console.error('Error capturarGuardarFoto:', error);
                    resolve(null);
                });
            }).catch(error => {
                console.error('Error capturarGuardarFoto:', error);
                resolve(null);
            });
        });
    }

    capturarFotoUrl() {
        return new Promise(resolve => {
            this.permissionService.solicitarPermisoEscritura().then(result => {
                this.mediaCapture.captureImage({ limit: 1 }).then((data: MediaFile[]) => {
                    if (data.length > 0) {
                        const url = decodeURIComponent(data[0].fullPath);
                        const nombre = url.replace(/^.*[\\\/]/, '');
                        const ruta = url.replace(/[^\/]*$/, '');
                        const extension = nombre.split('.').pop();
        
                        console.log('Url', url);
                        console.log('Nombre Foto', nombre);
                        console.log('Ruta Foto', ruta);
                        console.log('Extension Foto', extension);
        
                        let foto = {
                            url: data[0].fullPath,
                            nombreLocal: nombre,
                            rutaLocal: ruta,
                            extension: extension
                        }

                        resolve(foto);
                    }else{
                        resolve (null);
                    }
                }).catch(error => {
                    console.error('Error capturarVideoUrl:', error);
                    resolve(null);
                });
            });
        });
    }

    capturarFotoUrlOld() {
        return new Promise(resolve => {
            let options: CameraOptions = {
                quality: 50,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                correctOrientation: true,
                allowEdit: false
            };

            this.camera.getPicture(options).then((imageURL: string) => {
                const url = decodeURIComponent(imageURL);
                const nombre = url.replace(/^.*[\\\/]/, '');
                const ruta = url.replace(/[^\/]*$/, '');
                const extension = nombre.split('.').pop();

                console.log('Url', url);
                console.log('Nombre Foto', nombre);
                console.log('Ruta Foto', ruta);
                console.log('Extension Foto', extension);

                let foto = {
                    url: imageURL,
                    nombreLocal: nombre,
                    rutaLocal: ruta,
                    extension: extension
                }

                resolve(foto);
            }).catch(error => {
                console.error('Error capturarFotoUrl:', error);
                resolve(null);
            });
        });
    }

    galeriaFotoBlob() {
        return new Promise(resolve => {
            let options: CameraOptions = {
                quality: 50,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.ALLMEDIA,
                correctOrientation: true,
                allowEdit: false
            };

            this.camera.getPicture(options).then((imageData: string) => {
                let imageBlob = this.b64toBlob(imageData, 'image/jpeg');
                let nombreFoto = v4() + '.jpg';

                this.file.writeFile(this.file.dataDirectory, nombreFoto, imageBlob).then(response => {
                    let foto = {
                        nombre: nombreFoto,
                        url: this.file.dataDirectory + nombreFoto,
                        base64: imageData
                    }
                    
                    console.log('Captura de foto:', foto.url);

                    resolve(foto);
                }).catch(error => {
                    console.error('Error capturarGuardarFoto:', error);
                    resolve(null);
                });
            }).catch(error => {
                console.error('Error capturarGuardarFoto:', error);
                resolve(null);
            });
        });
    }

    galeriaFotoUrl() {
        return new Promise(resolve => {
            let options: CameraOptions = {
                quality: 50,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                correctOrientation: true,
                allowEdit: false
            };

            this.camera.getPicture(options).then((imageURL: string) => {
                const url = decodeURIComponent(imageURL);
                const nombre = url.replace(/^.*[\\\/]/, '');
                const ruta = url.replace(/[^\/]*$/, '');
                const extension = nombre.split('.').pop();

                console.log('Url', url);
                console.log('Nombre Foto', nombre);
                console.log('Ruta Foto', ruta);
                console.log('Extension Foto', extension);

                let foto = {
                    url: imageURL,
                    nombreLocal: nombre,
                    rutaLocal: ruta,
                    extension: extension
                }

                resolve(foto);
            }).catch(error => {
                console.error('Error capturarFotoUrl:', error);
                resolve(null);
            });
        });
    }

    capturarVideoUrl() {
        return new Promise(resolve => {
            this.permissionService.solicitarPermisoEscritura().then(result => {
                this.mediaCapture.captureVideo({ limit: 1, duration: 30 }).then((data: MediaFile[]) => {
                    if (data.length > 0) {
                        const url = decodeURIComponent(data[0].fullPath);
                        const nombreVideo = url.replace(/^.*[\\\/]/, '');
                        const rutaVideo = url.replace(/[^\/]*$/, '');
                        const extVideo = nombreVideo.split('.').pop();

                        console.log('Data', data[0]);
                        console.log('Url', url);
                        console.log('Nombre Video', nombreVideo);
                        console.log('Ruta Video', rutaVideo);
                        console.log('Extension Video', extVideo);

                        const options: TranscodeOptions = {
                            fileUri: data[0].fullPath,
                            outputFileName: nombreVideo,
                            saveToLibrary: true,
                            deleteInputFile: true,
                            maintainAspectRatio: true,
                            videoBitrate: 2500000
                        }
                        this.videoEditor.transcodeVideo(options).then(urlVideoCodificado => {
                            const urlNuevo = decodeURIComponent('file://' + urlVideoCodificado);
                            const nombreVideoNuevo = urlNuevo.replace(/^.*[\\\/]/, '');
                            const rutaVideoNuevo = urlNuevo.replace(/[^\/]*$/, '');
                            const extVideoNuevo = nombreVideoNuevo.split('.').pop();

                            console.log('Nuevo archivo', urlVideoCodificado);
                            console.log('Url Nuevo', urlNuevo);
                            console.log('Nombre Video Nuevo', nombreVideoNuevo);
                            console.log('Ruta Video Nuevo', rutaVideoNuevo);
                            console.log('Extension Video Nuevo', extVideoNuevo);

                            let video = {
                                url: urlNuevo,
                                nombreLocal: nombreVideoNuevo,
                                rutaLocal: rutaVideoNuevo,
                                extension: extVideoNuevo
                            }
                            console.log('Video: ', video);
    
                            resolve(video);
                        }).catch(error => {
                            console.log('Error en videoEditor', error);
                            resolve (null);
                        });
                    }else{
                        resolve (null);
                    }
                }).catch(error => {
                    console.error('Error capturarVideoUrl:', error);
                    resolve(null);
                });
            });
        });
    }

    galeriaVideoUrl() {
        return new Promise(resolve => {
            let options: CameraOptions = {
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.FILE_URI,
                mediaType: this.camera.MediaType.VIDEO
            };

            this.camera.getPicture(options).then((imageURL: string) => {
                const url = decodeURIComponent(imageURL);
                const nombre = url.replace(/^.*[\\\/]/, '');
                const ruta = url.replace(/[^\/]*$/, '');
                const extension = nombre.split('.').pop();

                console.log('Url', url);
                console.log('Nombre Foto', nombre);
                console.log('Ruta Foto', ruta);
                console.log('Extension Foto', extension);

                let foto = {
                    url: imageURL,
                    nombreLocal: nombre,
                    rutaLocal: ruta,
                    extension: extension
                }

                resolve(foto);
            }).catch(error => {
                console.error('Error capturarFotoUrl:', error);
                resolve(null);
            });
        });
    }

    eliminarArchivoLocal(urlLocal) {
        return new Promise(resolve => {
            const nombreArchivo = urlLocal.replace(/^.*[\\\/]/, '');
            const rutaArchivo = urlLocal.replace(/[^\/]*$/, '');

            this.file.removeFile(rutaArchivo, nombreArchivo).then(success => {
                resolve(true);
            }).catch((error) => {
                resolve(false);
            });
        });
    }

    b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    descargar(urlArchivo){
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                const url = decodeURIComponent(urlArchivo);
                const nombre = url.replace(/^.*[\\\/]/, '');
                const extension = nombre.split('.').pop();
                const nombreLocal = this.file.dataDirectory + nombre;

                const fileTransfer = this.transfer.create();
                fileTransfer.download(urlArchivo, nombreLocal).then(archivoDescargado => {
                    console.log('Archivo descargado', archivoDescargado);
                    const win: any = window;
                    const url = win.Ionic.WebView.convertFileSrc(archivoDescargado.nativeURL)
                    const urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);

                    resolve({exitoso: true, mensaje: 'Archivo descargado exitosamente.', url: url, urlSafe: urlSafe, nativeURL: archivoDescargado.nativeURL});
                }).catch(error => {
                    resolve({exitoso: false, mensaje: 'Error al descargar multimedia.'});
                });
            } else {
                resolve({exitoso: false, mensaje: 'No existe conexion!'});
            }
        });
    }

    existeArchivo(urlArchivo){
        return new Promise(resolve => {
            const url = decodeURIComponent(urlArchivo);
            const nombre = url.replace(/^.*[\\\/]/, '');
            const extension = nombre.split('.').pop();
            console.log('Extension', extension);

            console.log('Revisando archivo', this.file.dataDirectory, nombre);
            this.file.checkFile(this.file.dataDirectory, nombre).then(existe => {
                if(existe){
                    const win: any = window;
                    const url = win.Ionic.WebView.convertFileSrc(this.file.dataDirectory + nombre)
                    const urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(extension === 'mp4' ? (url + '#t=0.1') : url);

                    let data = {existe: true, url: url, urlSafe: urlSafe, nativeURL: this.file.dataDirectory + nombre}
                    console.log('Existe archivo', data);

                    resolve(data);
                }else{
                    let data = {existe: false, url: url}
                    console.log('No existe archivo', data);

                    resolve({existe: false, url: url});
                }
            }).catch(error => {
                console.error('Error al revisar archivo', this.file.dataDirectory, nombre, error);

                resolve({existe: false, url: url});
            });;
        });
    }

}
