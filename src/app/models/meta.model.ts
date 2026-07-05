export class Meta {
    idGoal?: number;
    monthlyLimitKwh?: number;
    alertThresholdPercentage?: number;
    idHome?: number;
    idRoom?: number;
    idDevice?: number;
    targetName?: string; // Nombre del objetivo (Casa, Cuarto o Equipo)
    type?: string;       // 'CASA', 'CUARTO', 'DISPOSITIVO'
    status?: number;
}