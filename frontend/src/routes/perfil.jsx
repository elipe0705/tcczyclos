import { Outlet, createFileRoute } from "@tanstack/react-router";
// Layout de /perfil: o próprio perfil fica em perfil.index.jsx e o de outras pessoas em perfil.$username.jsx
export const Route = createFileRoute("/perfil")({ component: () => <Outlet /> });
