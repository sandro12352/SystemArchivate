import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../auth/services/auth-service';
import { CampaignService } from '../../services/campaign-service';
import {
    FacebookAd,
    FacebookConnection,
    FacebookAdAccount,
    AdStatus,
} from '../../interfaces/campaign.interface';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-campaigns-component',
    standalone: true,
    imports: [CommonModule, DialogModule, TooltipModule],
    templateUrl: './campaigns-component.html',
    styleUrl: './campaigns-component.css',
})
export class CampaignsComponent implements OnInit {
    // === Inyecciones ===
    private authService = inject(AuthService);
    private campaignService = inject(CampaignService);
    private route = inject(ActivatedRoute);

    // === Propiedades y estado ===
    user = this.authService.getUserSession();
    facebookConnection = signal<FacebookConnection | null>(null);
    adAccounts = signal<FacebookAdAccount[]>([]);
    activeAds = signal<FacebookAd[]>([]);
    isLoading = signal<boolean>(true);
    isConnecting = signal<boolean>(false);
    isLoadingAds = signal<boolean>(false);
    showAdAccountDialog = signal<boolean>(false);
    selectedAd = signal<FacebookAd | null>(null);
    showAdDetailDialog = signal<boolean>(false);
    showConnectionWizard = signal<boolean>(false);
    connectionError = signal<string | null>(null);
    currentView = signal<'grid' | 'list'>('grid');

    // Estado de filtros y búsqueda
    searchQuery = signal<string>('');

    // === Computeds ===
    totalAds = computed(() => this.activeAds().length);

    totalImpressions = computed(() => {
        return this.activeAds().reduce((sum, ad) => {
            return sum + (parseInt(ad.insights?.impressions || '0', 10));
        }, 0);
    });

    totalReach = computed(() => {
        return this.activeAds().reduce((sum, ad) => {
            return sum + (parseInt(ad.insights?.reach || '0', 10));
        }, 0);
    });

    totalSpend = computed(() => {
        return this.activeAds().reduce((sum, ad) => {
            return sum + (parseFloat(ad.insights?.spend || '0'));
        }, 0);
    });

    filteredAds = computed(() => {
        const query = this.searchQuery().toLowerCase();
        if (!query) return this.activeAds();
        return this.activeAds().filter(ad =>
            ad.name.toLowerCase().includes(query) ||
            ad.campaign_name?.toLowerCase().includes(query) ||
            ad.adset_name?.toLowerCase().includes(query)
        );
    });

    isConnected = computed(() => {
        const conn = this.facebookConnection();
        return conn !== null && conn.estado === 'activo';
    });

    // === Métodos ===
    ngOnInit(): void {
        this.setupMessageListener();
        this.handleOAuthCallback();
        this.loadFacebookConnection();
    }

    private setupMessageListener(): void {
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'FB_AUTH_SUCCESS' && event.data.code) {
                this.processAuthCode(event.data.code);
            }
        });
    }

    private handleOAuthCallback(): void {
        this.route.queryParams.subscribe(params => {
            const code = params['code'];
            if (code) {
                if (window.opener && window.opener !== window) {
                    window.opener.postMessage({ type: 'FB_AUTH_SUCCESS', code }, window.location.origin);
                    window.close();
                    return;
                }

                if (this.user?.token) {
                    this.processAuthCode(code);
                }
            }
        });
    }

    private processAuthCode(code: string): void {
        if (!this.user?.token) return;

        this.isConnecting.set(true);
        this.connectionError.set(null);

        this.campaignService.connectFacebook(this.user.token, code)
            .pipe(finalize(() => {
                this.isConnecting.set(false);
            }))
            .subscribe({
                next: (connection) => {
                    this.facebookConnection.set(connection);
                    this.showConnectionWizard.set(false);
                    this.loadActiveAds();
                },
                error: (err) => {
                    console.error('Error al conectar Facebook:', err);
                    this.connectionError.set('No se pudo vincular la cuenta. Intenta nuevamente.');
                }
            });
    }

    private loadFacebookConnection(): void {
        if (!this.user?.token) {
            this.isLoading.set(false);
            return;
        }

        this.campaignService.getFacebookConnection(this.user.token)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (connection) => {
                    this.facebookConnection.set(connection);
                    if (connection && connection.estado === 'activo') {
                        this.loadActiveAds();
                    }
                },
                error: (err) => {
                    console.error('Error al verificar conexión:', err);
                }
            });
    }

    loadActiveAds(): void {
        if (!this.user?.token) return;

        this.isLoadingAds.set(true);
        this.campaignService.getActiveAds(this.user.token)
            .pipe(finalize(() => this.isLoadingAds.set(false)))
            .subscribe({
                next: (ads) => {
                    this.activeAds.set(ads);
                },
                error: (err) => {
                    console.error('Error al cargar anuncios:', err);
                }
            });
    }

    connectFacebook(): void {
        if (!this.user?.token) return;

        this.showConnectionWizard.set(true);
        this.connectionError.set(null);

        const authUrl = this.campaignService.getFacebookAuthUrl();

        const width = 600;
        const height = 750;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);

        // Dentro de tu connectFacebook() en lugar de window.open
        (window as any).FB.login((response: any) => {
            if (response.authResponse) {
                // Facebook te da el token directamente aquí
                const code = response.authResponse.code; // Si usas response_type code
                this.campaignService.connectFacebook(this.user!.token!, code).subscribe({
                    next: (connection) => {
                        this.facebookConnection.set(connection);
                        this.showConnectionWizard.set(false);
                        this.loadActiveAds();
                    },
                    error: (err) => {
                        console.error('Error al conectar Facebook:', err);
                        this.connectionError.set('No se pudo vincular la cuenta. Intenta nuevamente.');
                    }
                }
                );
            }
        }, {
            scope: 'ads_management,ads_read,business_management',
            config_id: 'TU_CONFIGURATION_ID' // Esto es lo que da el diseño de la imagen
        });
    }

    disconnectFacebook(): void {
        if (!this.user?.token) return;

        this.campaignService.disconnectFacebook(this.user.token)
            .subscribe({
                next: () => {
                    this.facebookConnection.set(null);
                    this.activeAds.set([]);
                },
                error: (err) => {
                    console.error('Error al desconectar:', err);
                }
            });
    }

    openAdDetail(ad: FacebookAd): void {
        this.selectedAd.set(ad);
        this.showAdDetailDialog.set(true);
    }

    closeAdDetail(): void {
        this.showAdDetailDialog.set(false);
        this.selectedAd.set(null);
    }

    onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set(input.value);
    }

    toggleView(view: 'grid' | 'list'): void {
        this.currentView.set(view);
    }

    getAdStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            [AdStatus.ACTIVE]: 'Activo',
            [AdStatus.PAUSED]: 'Pausado',
            [AdStatus.DELETED]: 'Eliminado',
            [AdStatus.ARCHIVED]: 'Archivado',
            [AdStatus.PENDING_REVIEW]: 'En Revisión',
            [AdStatus.DISAPPROVED]: 'Rechazado',
            [AdStatus.WITH_ISSUES]: 'Con Problemas',
        };
        return labels[status] || status;
    }

    formatNumber(value: string | number | undefined): string {
        if (value === undefined) return '0';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '0';
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
        return num.toLocaleString('es-PE');
    }

    formatCurrency(value: string | number | undefined): string {
        if (value === undefined) return '$0.00';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '$0.00';
        return '$' + num.toFixed(2);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    getCtaLabel(cta?: string): string {
        const labels: Record<string, string> = {
            'LEARN_MORE': 'Más Información',
            'SHOP_NOW': 'Comprar Ahora',
            'SIGN_UP': 'Registrarse',
            'SEND_MESSAGE': 'Enviar Mensaje',
            'WHATSAPP_MESSAGE': 'WhatsApp',
        };
        return labels[cta || ''] || cta || '';
    }
}
