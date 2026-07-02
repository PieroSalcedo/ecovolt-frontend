export class Vivienda {
    idHome?: number;
    address?: string;
    city?: string;
    alias?: string;
    energyTariff?: number;
    squareMeters?: number;
    idPropertyType?: number; // Para el request
    propertyTypeName?: string; // Para mostrar en la tabla
    idUser?: number;
}