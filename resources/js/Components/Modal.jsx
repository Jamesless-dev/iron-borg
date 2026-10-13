import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ show, onClose, children, maxWidth = "lg" }) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    if (!show) return null;

    const maxWidthClass =
        {
            sm: "max-w-md",
            md: "max-w-lg",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            "2xl": "max-w-5xl",
        }[maxWidth] || "max-w-2xl";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto animate-fade-in-up`}
            >
                {children}
            </div>
        </div>
    );
}
