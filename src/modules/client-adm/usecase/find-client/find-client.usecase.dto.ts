
export interface FindClientUseCaseInputDto {
    id: string
}

export interface FindClientUseCaseOutputDto {
    id: string
    name: string
    email: string
    document: string
    createdAt: Date
    updatedAt: Date
}