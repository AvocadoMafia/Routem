"use client";

import { Route } from "@/lib/client/types";
import RouteEditorClient from "../../_components/RouteEditorClient";

export default function ClientRoot({ route }: { route: Route }) {
    return <RouteEditorClient mode="edit" initialRoute={route} />;
}
