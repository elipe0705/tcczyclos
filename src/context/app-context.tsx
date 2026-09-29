import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AppContextValue = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  toast: string;
  notify: (message: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(["2"]);
  const [toast, setToast] = useState("");
  const value = useMemo(() => ({
    favorites,
    toggleFavorite: (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    toast,
    notify: (message: string) => {
      setToast(message);
      window.setTimeout(() => setToast(""), 2600);
    },
  }), [favorites, toast]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}