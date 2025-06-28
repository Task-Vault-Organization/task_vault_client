export type GetUser = {
    id: string,
    email: string,
    rootDirectoryId?: string,
    profilePhotoId?: string,
    googleProfilePhotoUrl?: string,
    totalFileSize: number
}