import { useState } from "react"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { updateProfile } from "../api/DevTreeAPI"
import { User } from "../types"

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social)

    const queryClient = useQueryClient()
    const user: User = queryClient.getQueryData(["user"])!
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Actualizado correctamente")
        }
    })

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link)
        setDevTreeLinks(updatedLinks)
    }

    const handleEnableLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetwork) {
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled }
                } else {
                    toast.error("URL no válida")
                }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)

        queryClient.setQueryData(["user"], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks)
            }
        })
    }

    return (
        <>
            <div className=" space-y-5">
                {devTreeLinks.map(item => (
                    <DevTreeInput
                        key={item.name}
                        item={item}
                        handleUrlChange={handleUrlChange}
                        handleEnableLink={handleEnableLink}
                    />
                ))}
                <button
                    className=" bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
                    onClick={() => mutate(user)}>
                    Guardar Cambios
                </button>
            </div>
        </>
    )
}