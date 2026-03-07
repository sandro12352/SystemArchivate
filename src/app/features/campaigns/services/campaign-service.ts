import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FacebookAd, FacebookAdAccount, FacebookCampaign, FacebookConnection } from '../interfaces/campaign.interface';

@Injectable({
    providedIn: 'root',
})
export class CampaignService {
    private http = inject(HttpClient);

    /**
     * Obtiene el estado de conexión de Facebook del cliente
     */
    getFacebookConnection(token: string): Observable<FacebookConnection | null> {
        return this.http.get<FacebookConnection | null>(
            `${environment.API_URL}/api/campaigns/facebook/connection`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Conecta la cuenta de Facebook usando el code de OAuth
     */
    connectFacebook(token: string, code: string): Observable<FacebookConnection> {
        return this.http.post<FacebookConnection>(
            `${environment.API_URL}/api/campaigns/facebook/connect`,
            { code },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Desconecta la cuenta de Facebook
     */
    disconnectFacebook(token: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(
            `${environment.API_URL}/api/campaigns/facebook/disconnect`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Obtiene las cuentas publicitarias de Facebook
     */
    getAdAccounts(token: string): Observable<FacebookAdAccount[]> {
        return this.http.get<FacebookAdAccount[]>(
            `${environment.API_URL}/api/campaigns/facebook/ad-accounts`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Selecciona una cuenta publicitaria
     */
    selectAdAccount(token: string, adAccountId: string): Observable<FacebookConnection> {
        return this.http.patch<FacebookConnection>(
            `${environment.API_URL}/api/campaigns/facebook/ad-account`,
            { ad_account_id: adAccountId },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Obtiene las campañas activas del cliente
     */
    getActiveCampaigns(token: string): Observable<FacebookCampaign[]> {
        return this.http.get<FacebookCampaign[]>(
            `${environment.API_URL}/api/campaigns/active`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Obtiene los anuncios activos del cliente
     */
    getActiveAds(token: string): Observable<FacebookAd[]> {
        return this.http.get<FacebookAd[]>(
            `${environment.API_URL}/api/campaigns/ads/active`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Obtiene los insights de un anuncio específico
     */
    getAdInsights(token: string, adId: string): Observable<FacebookAd> {
        return this.http.get<FacebookAd>(
            `${environment.API_URL}/api/campaigns/ads/${adId}/insights`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }

    /**
     * Genera la URL de autorización de Facebook
     */
    getFacebookAuthUrl(): string {
        const appId = '1582195016235148'; // Se configurará en el backend
        const redirectUri = encodeURIComponent(`${environment.PATH}home/campanas`);
        const scope = encodeURIComponent('ads_management,ads_read,business_management,pages_read_engagement');
        return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    }

    /**
     * Obtiene la URL de auth de Facebook desde el backend (recomendado)
     */
    getAuthUrl(token: string): Observable<{ url: string }> {
        return this.http.get<{ url: string }>(
            `${environment.API_URL}/api/campaigns/facebook/auth-url`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    }
}
