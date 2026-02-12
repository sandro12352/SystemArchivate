import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { SignaturePadComponent } from '../../../../shared/components/signature-pad/signature-pad.component';
import { ContractService } from '../../services/contract.service';
import { Contrato } from '../../interfaces/contract.interface';
import { AuthService } from '../../../auth/services/auth-service';
import { finalize } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-contracts-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Button,
        CardModule,
        TextareaModule,
        SkeletonModule,
        TooltipModule,
        DialogModule,
        SignaturePadComponent
    ],
    templateUrl: './contracts-list-component.html',
    styleUrl: './contracts-list-component.css'
})
export class ContractsListComponent implements OnInit {
    private contractService = inject(ContractService);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    private sanitizer = inject(DomSanitizer);

    user = this.authService.getUserSession();
    contratoActual = signal<Contrato | null>(null);
    cargando = signal<boolean>(true);
    guardando = signal<boolean>(false);
    firmando = signal<boolean>(false);
    observacionTemporal = signal<string>('');

    mostrarModalFirma = signal<boolean>(false);
    mostrarModalVisor = signal<boolean>(false);

    firmaBlob = signal<Blob | null>(null);
    urlDocumentoSegura = signal<SafeResourceUrl | null>(null);
    tituloVisor = signal<string>('Visualización de Documento');

    ngOnInit(): void {
        this.cargarContrato();
    }

    cargarContrato(): void {
        if (!this.user?.token) return;

        this.cargando.set(true);
        this.contractService.getContratoReciente(this.user.token)
            .pipe(finalize(() => this.cargando.set(false)))
            .subscribe({
                next: (contrato) => {
                    if (contrato) {
                        this.contratoActual.set(contrato);
                        this.observacionTemporal.set(contrato.observacion || '');
                    }
                },
                error: (err) => {
                    console.error('Error al cargar contrato:', err);
                    // Mock data for demo/development if error
                    this.contratoActual.set({
                        id_contrato: 1,
                        id_cliente: 1,
                        contrato_url: 'https://www.ing.uc.cl/wp-content/uploads/2017/07/Prec%C3%A1lculo.pdf',
                        plan_marketing_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        observacion: 'Esperando revisión del plan de marketing.',
                        fecha_creacion: new Date()
                    });
                    this.observacionTemporal.set(this.contratoActual()?.observacion || '');
                }
            });
    }

    guardarObservacion(): void {
        const contrato = this.contratoActual();
        if (!contrato || !this.user?.token) return;

        this.guardando.set(true);
        this.contractService.actualizarObservacion(contrato.id_contrato, this.observacionTemporal(), this.user.token)
            .pipe(finalize(() => this.guardando.set(false)))
            .subscribe({
                next: (actualizado) => {
                    this.contratoActual.set(actualizado);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Observación actualizada correctamente'
                    });
                },
                error: (err) => {
                    console.error('Error al guardar observación:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo actualizar la observación'
                    });
                }
            });
    }

    abrirModalFirma(): void {
        if (this.contratoActual()?.firma_url) {
            this.messageService.add({
                severity: 'info',
                summary: 'Contrato ya firmado',
                detail: 'Este contrato ya ha sido firmado digitalmente.'
            });
            return;
        }
        this.mostrarModalFirma.set(true);
    }

    onFirmaCapturada(blob: Blob | null): void {
        this.firmaBlob.set(blob);
    }

    confirmarFirma(): void {
        const contrato = this.contratoActual();
        const blob = this.firmaBlob();

        if (!contrato || !blob || !this.user?.token) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Por favor, realiza tu firma antes de confirmar.'
            });
            return;
        }

        this.firmando.set(true);
        this.contractService.enviarFirma(contrato.id_contrato, blob, this.user.token)
            .pipe(finalize(() => this.firmando.set(false)))
            .subscribe({
                next: (actualizado) => {
                    this.contratoActual.set(actualizado);
                    this.mostrarModalFirma.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Firma Exitosa',
                        detail: 'El contrato ha sido firmado correctamente.'
                    });
                },
                error: (err) => {
                    console.error('Error al enviar firma:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo procesar la firma digital.'
                    });
                }
            });
    }


    verDocumento(url: string, title: string): void {
        if (url) {
            this.router.navigate(['/home/contratos/visor'], {
                queryParams: { url: url, title: title }
            });
        }
    }
}
