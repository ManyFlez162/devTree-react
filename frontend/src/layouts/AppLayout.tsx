import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ["user"],
        retry: 1,
        refetchOnWindowFocus: false
    })

    if(isLoading) return "Redireccionando..."
    if(isError) return <Navigate to={"/auth/login"}/> // Medida de seguridad en caso de querer acceder al panel de admin sin iniciar sesión
    if(data) return <DevTree data={data} />
}