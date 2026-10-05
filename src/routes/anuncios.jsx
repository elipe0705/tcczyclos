import { Outlet, createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/anuncios")({ component: () => <Outlet /> });
