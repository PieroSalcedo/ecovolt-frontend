import { Option } from "../models/option.models";

export class JwtDTO {
    token?: string;
    type?: string;
    idUser?: number;
    login?: string;
    fullName?: string;
    roles?: string[];
    opciones?: Option[];
}