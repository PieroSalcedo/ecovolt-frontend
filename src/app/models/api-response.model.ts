export class ApiResponseDto<T> {
    title?: string;
    message?: string;
    status?: string; 
    data?: T;
}