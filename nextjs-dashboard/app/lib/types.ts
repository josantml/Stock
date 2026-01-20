// Tipos para Server Actions

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message: string | null;
}

export type ProductState = {
    errors?: Record<string, string[]>;
    message?: string | null;
}

export type CategoryState = {
    errors?:{
        name?: string[],
        description?: string[]
    };
    message: string | null;
};

export type OrderState = {
    message?: string | null;
    orderId?: string;
};
