export interface FacebookAdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  currency: string;
  business_name?: string;
}

export interface FacebookCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
  created_time: string;
  updated_time: string;
  buying_type?: string;
  bid_strategy?: string;
}

export interface FacebookAd {
  id: string;
  name: string;
  status: AdStatus;
  campaign_id: string;
  campaign_name?: string;
  adset_id: string;
  adset_name?: string;
  creative?: AdCreative;
  created_time: string;
  updated_time: string;
  insights?: AdInsights;
}

export interface AdCreative {
  id: string;
  name?: string;
  title?: string;
  body?: string;
  image_url?: string;
  thumbnail_url?: string;
  video_id?: string;
  call_to_action_type?: string;
  link_url?: string;
  instagram_permalink_url?: string;
}

export interface AdInsights {
  impressions: string;
  reach: string;
  clicks: string;
  ctr: string;
  spend: string;
  cpc?: string;
  cpm?: string;
  actions?: AdAction[];
}

export interface AdAction {
  action_type: string;
  value: string;
}

export interface FacebookConnection {
  id_conexion?: number;
  id_cliente: number;
  facebook_user_id: string;
  facebook_user_name: string;
  facebook_user_picture?: string;
  access_token: string;
  ad_account_id?: string;
  ad_account_name?: string;
  fecha_conexion: Date;
  estado: 'activo' | 'inactivo' | 'expirado';
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED'
}

export enum AdStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  DISAPPROVED = 'DISAPPROVED',
  WITH_ISSUES = 'WITH_ISSUES'
}
