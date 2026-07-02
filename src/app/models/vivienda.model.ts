export class Vivienda {
    idHome?: number;
    alias?: string;
    address?: string;
    city?: string;
    energyTariff?: number;
    squareMeters?: number;
    // Estos campos vienen del ResponseDTO de tu Java
    idPropertyType?: number;
    propertyTypeName?: string; 
}