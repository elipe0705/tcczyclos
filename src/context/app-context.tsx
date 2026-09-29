import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type MockUser = {
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
};

type AppContextValue = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  toast: string;
  notify: (message: string) => void;
  user: MockUser | null;
  signIn: (email: string) => void;
  signUp: (user: MockUser) => void;
  signOut: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(["2"]);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<MockUser | null>(null);
  const value = useMemo(() => ({
    favorites,
    toggleFavorite: (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    toast,
    notify: (message: string) => {
      setToast(message);
      window.setTimeout(() => setToast(""), 2600);
    },
    user,
    signIn: (email: string) => setUser({ name: "Luis Fernando", username: "luis.zyclos", email }),
    signUp: (newUser: MockUser) => setUser(newUser),
    signOut: () => setUser(null),
  }), [favorites, toast, user]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}