import { TipoHabContextProvider } from "@/app/context/TipoHabProvider"

const Layout = ({children}) => {
    return (
        <TipoHabContextProvider>
        {children}
        </TipoHabContextProvider>
    )
}

export default Layout;