import {MdClose, MdExplore, MdSearch} from "react-icons/md";
import {Box, Button, Drawer, InputAdornment, MenuItem, Stack, TextField, useMediaQuery, useTheme} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {useState} from "react";

interface ExploreCardProps {
    isSidebar?: boolean;
}

export default function ExploreCard({ isSidebar = false }: ExploreCardProps) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

    const handleSearch = () => {
        setIsMobileModalOpen(false);
        router.push("/explore?where=chiba");
    };

    const textFieldSx = {
        "& .MuiInputLabel-root": {
            color: "var(--foreground-1)",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transform: "translate(14px, -9px) scale(1)",
            backgroundColor: "var(--background-1)",
            padding: "0 8px",
            borderRadius: "4px",
            zIndex: 1,
            "&.Mui-focused": {
                color: "var(--accent-0)",
            },
        },

        "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            color: "var(--foreground-0)",
            backgroundColor: "var(--background-1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

            "& fieldset": {
                borderColor: "rgba(var(--foreground-0-rgb), 0.08)",
                borderWidth: "1px",
            },
            "&:hover fieldset": {
                borderColor: "rgba(var(--foreground-0-rgb), 0.2)",
            },
            "&.Mui-focused fieldset": {
                borderColor: "var(--accent-0)",
                borderWidth: "2px",
            }
        },

        "& input": {
            color: "var(--foreground-0)",
            fontSize: "0.95rem",
            padding: "16px",
            fontWeight: 500,
        },

        "& .MuiInputAdornment-root p": {
            color: "var(--foreground-1) !important",
            fontWeight: 600,
            fontSize: "1rem",
        },

        "& .MuiSelect-select": {
            padding: "16px",
        },

        "& .MuiSelect-icon": {
            color: "var(--foreground-1) !important",
            right: "12px",
            transition: "all 0.3s ease",
        },
        "& .Mui-focused .MuiSelect-icon": {
            color: "var(--accent-0) !important",
            transform: "rotate(180deg)",
        },
    };

    const cardContent = (
        <Stack spacing={6}>
            <div className="flex flex-row items-start justify-between text-left gap-3">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent-0 flex items-center justify-center shadow-lg shadow-accent-0/20">
                        <MdExplore className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground-0">Explore</h1>
                        <p className="text-[10px] font-bold text-accent-0 tracking-[0.2em] uppercase">
                            Find your next story
                        </p>
                    </div>
                </div>
                {/* 閉じるボタン - モバイルモーダル時のみ */}
                {isMobile && isSidebar && (
                    <button
                        onClick={() => setIsMobileModalOpen(false)}
                        className="p-2 rounded-full bg-background-0 text-foreground-1 shadow-sm z-50 hover:bg-grass transition-colors"
                    >
                        <MdClose size={24} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <TextField
                    label="What"
                    placeholder="Nature, Onsen, Driving..."
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldSx}
                />

                <TextField
                    label="Where"
                    placeholder="Nagano, Japan"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldSx}
                />

                <div className="grid grid-cols-2 gap-8">
                    <TextField
                        label="When"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        sx={textFieldSx}
                    />
                    <TextField
                        select
                        label="Who"
                        fullWidth
                        defaultValue="solo"
                        sx={textFieldSx}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    >
                        <MenuItem value="solo">Solo</MenuItem>
                        <MenuItem value="friends">Friends</MenuItem>
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="couple">Couple</MenuItem>
                    </TextField>
                </div>

                <TextField
                    label="Budget"
                    type="number"
                    fullWidth
                    sx={textFieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <span className="text-foreground-0 font-light mr-1">¥</span>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <button 
                onClick={handleSearch}
                className="group relative w-full py-5 mt-2 bg-foreground-0 text-background-0 rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:bg-accent-1 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-foreground-0/10"
            >
                <span className="relative z-10 tracking-widest uppercase text-sm">
                    Search Routes
                </span>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        →
                    </motion.span>
                </div>
            </button>
        </Stack>
    );

    if (isMobile && isSidebar) {
        return (
            <>
                <button
                    onClick={() => setIsMobileModalOpen(true)}
                    className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full bg-accent-0 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                >
                    <MdExplore size={28} />
                </button>

                <Drawer
                    anchor="bottom"
                    open={isMobileModalOpen}
                    onClose={() => setIsMobileModalOpen(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: "24px 24px 0 0",
                            backgroundColor: "var(--background-1)",
                            padding: "32px 24px 48px",
                            maxHeight: "90vh",
                        }
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <div className="w-12 h-1 bg-grass rounded-full mx-auto mb-8 opacity-50" />
                        {cardContent}
                    </Box>
                </Drawer>
            </>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
                w-full max-w-[480px] h-auto
                px-10 py-12 flex flex-col gap-10 bg-background-1 backdrop-blur-xl
                ${isSidebar ? "hidden md:flex h-full border-r-2 border-grass/20 shadow-none rounded-none" : "rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/10 mx-4"}
            `}
            transition={{
                layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5 },
                x: { duration: 0.5 }
            }}
        >
            {cardContent}
        </motion.div>
    )
}
