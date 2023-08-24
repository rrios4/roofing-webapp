export type IGoogleUser = {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    picture: string;
    provider_id: string;
    sub: string;
}

export type IDbCustomer = {
    id: number;
    customer_type_id: number;
    first_name: string;
    last_name: string;
    street_address: string;
    city: string;
    zipcode: string;
    phone_number: string;
    email: string;
    updated_at: string | null;
    created_at: string;
    company_name: string | null;
    state: string;
    customer_type: IDbCustomerType
}

export type IDbCustomerType = {
    id: number;
    name: string;
    description: string;
    updated_at: string | null;
    created_at: string;
}

export type IFormAddCustomer = {
    first_name: string;
    last_name:string;
    customer_tpye: string;
    email: string;
    phone_number: string;
    street_address: string;
    city: string;
    state:string; 
    zipcode: string;
}