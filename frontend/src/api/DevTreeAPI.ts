import { isAxiosError } from "axios"
import api from "../config/axios"
import { ProfileForm, User } from "../types";

export async function getUser() {
    
    try {
        const { data } = await api<User>("/user") // por default api es un método get, no es necesario poner api.get()
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function updateProfile(formData: User) {
    
    try {
        const { data } = await api.patch<string>("/user", formData) 
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function uploadImage(file: File) {
    let formData = new FormData()
    formData.append("file", file)

    try {
        const { data: image }: {data: {image: string}}  = await api.post("user/image", formData)
        return image
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}