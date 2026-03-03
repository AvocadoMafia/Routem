import {MdExplore} from "react-icons/md";
import {InputAdornment, MenuItem, Stack, TextField} from "@mui/material";
import { motion } from "framer-motion";

export default function ExploreCard() {

    const textFieldSx = {
        "& .MuiInputLabel-root": {
            color: "var(--foreground-0)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--accent-1)",
        },

        "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            color: "var(--foreground-0)",

            "& fieldset": {
                borderColor: "var(--foreground-0)",
            },
            "&:hover fieldset": {
                borderColor: "var(--foreground-0)",
            },
            "&.Mui-focused fieldset": {
                borderColor: "var(--accent-1)",
                borderWidth: "2px",
            },
        },

        /* 入力文字 */
        "& input": {
            color: "var(--foreground-0)",
        },

        /* ¥ マーク（InputAdornment） */
        "& .MuiInputAdornment-root": {
            color: "var(--foreground-0)",
        },

        /* Selectの矢印 */
        "& .MuiSelect-icon": {
            color: "var(--foreground-0)",
        },


    };

    return (
        <motion.div
            className="w-full max-w-[600px] h-auto backdrop-blur-md border-2 border-background-1/90 rounded-xl px-8 py-6 shadow-2xl flex flex-col gap-6 bg-background-1/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{type: "spring", stiffness: 200, damping: 15}}
        >
            {/* タイトル */}
            <div className="flex flex-row items-center gap-3">
                <MdExplore className="text-3xl" />
                <div className={'flex flex-col gap-1'}>
                    <h1 className="text-2xl font-bold">Explore Routes</h1>
                    <p
                        className="w-fit text-sm font-semibold bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, var(--accent-0), var(--accent-1))",
                        }}
                    >
                        Clarify your ideas of journey
                    </p>
                </div>
            </div>

            <Stack spacing={3}>
                <TextField
                    label="What"
                    placeholder="#富士山 #日帰り #温泉"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldSx}
                />

                <TextField
                    label="Where"
                    placeholder="Tokyo, Japan"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={textFieldSx}
                />

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

                <TextField
                    label="Max Budget"
                    type="number"
                    fullWidth
                    sx={{
                        ...textFieldSx,
                        /* ¥ の色 */
                        "& .MuiInputAdornment-root": {
                            color: "var(--foreground-1)",
                        },

                        /* Chrome系スピナー（上下矢印） */
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            filter: "brightness(0) saturate(100%) invert(1)",
                            /* ダークテーマ想定。
                               ライトなら不要 or 調整してください */
                        },

                        /* Firefox対策 */
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                ¥
                            </InputAdornment>
                        ),
                    }}
                />

                <button className={'w-full h-fit py-4 px-4 bg-accent-1 text-white rounded-xl font-bold hover:bg-accent-2'}>
                    Search Routes
                </button>
            </Stack>
        </motion.div>
    )
}
