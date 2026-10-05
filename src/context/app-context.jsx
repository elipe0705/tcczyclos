import { createContext, useContext, useMemo, useState } from "react";
const AppContext = createContext(undefined);
export function AppProvider({ children }) {
    const [favorites, setFavorites] = useState(["2"]);
    const [toast, setToast] = useState("");
    const [user, setUser] = useState(null);
    const value = useMemo(() => ({
        favorites,
        toggleFavorite: (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
        toast,
        notify: (message) => {
            setToast(message);
            window.setTimeout(() => setToast(""), 2600);
        },
        user,
        signIn: (email) => setUser({ name: "Luis Fernando", username: "luis.zyclos", email }),
        signUp: (newUser) => setUser(newUser),
        signOut: () => setUser(null),
    }), [favorites, toast, user]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
    const value = useContext(AppContext);
    if (!value)
        throw new Error("useApp must be used within AppProvider");
    return value;
}
