export interface Contrato {
    id_contrato: number;
    id_cliente: number;
    contrato_url: string;
    plan_marketing_url: string;
    firma_url?: string;
    observacion: string;
    fecha_creacion?: Date;
    nombre_cliente?: string;
}
