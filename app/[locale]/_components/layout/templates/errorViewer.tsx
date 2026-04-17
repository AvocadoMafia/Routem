'use client'

import { errorStore } from "@/lib/client/stores/errorStore";
import ErrorCard from "@/app/[locale]/_components/layout/ingredients/errorCard";
import { AnimatePresence } from "framer-motion";

export default function ErrorViewer() {
    const errors = errorStore(state => state.error);
    const deleteError = errorStore(state => state.deleteError);

    return (
        <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-3 items-end pointer-events-none w-fit max-w-[calc(100vw-2rem)]">
            <AnimatePresence initial={false}>
                {errors.map((error) => (
                    <ErrorCard 
                        key={error.id} 
                        error={error} 
                        onDelete={() => deleteError(error.id)} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
