export interface AddClientInputDto {
    id?: string
    name: string
    email: string
    document: string
}

export interface AddClientOutputDto {
    id: string
    name: string
    email: string
    document: string
    createdAt: Date
    updatedAt: Date
}