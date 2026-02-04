'use client'

import { HiArrowsUpDown, HiMapPin, HiGlobeAsiaAustralia, HiTag, HiArrowsRightLeft } from "react-icons/hi2";
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, OutlinedInput } from "@mui/material";
import { useState } from "react";

export default function RouteFilter() {
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("all");
    const [distance, setDistance] = useState<string | number>("");
    const [resident, setResident] = useState("all");
    const [sort, setSort] = useState("likes");

    return (
        <Box className={'w-full bg-background-1 p-6'}>
            <Box className={'flex flex-col gap-6'}>
                {/* 検索・フィルターセクション */}
                <Box className={'flex flex-wrap gap-6 items-end'}>
                    {/* 地名検索 */}
                    <Box className={'flex flex-col gap-2'}>
                        <TextField
                            label="Location"
                            placeholder="Search by area..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            size="small"
                            sx={{
                                width: { xs: 200, md: 220 },
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'var(--background-0)',
                                    borderRadius: 1,
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' }
                                }
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HiMapPin className={'w-4 h-4 text-foreground-1/70'} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    {/* カテゴリ */}
                    <FormControl size="small" sx={{ width: { xs: 200, md: 220 } }}>
                        <InputLabel id="category-label" shrink>Category</InputLabel>
                        <Select
                            labelId="category-label"
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value as string)}
                            input={
                                <OutlinedInput
                                    notched
                                    sx={{
                                        backgroundColor: 'var(--background-0)',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '& fieldset': { border: 'none' },
                                        '&:hover fieldset': { border: 'none' },
                                        '&.Mui-focused fieldset': { border: 'none' }
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <HiTag className={'w-4 h-4 text-foreground-1/70'} />
                                        </InputAdornment>
                                    }
                                />
                            }
                        >
                            <MenuItem value="all">All Categories</MenuItem>
                            <MenuItem value="history">History</MenuItem>
                            <MenuItem value="beach">Beach</MenuItem>
                            <MenuItem value="food">Food</MenuItem>
                            <MenuItem value="city">City</MenuItem>
                            <MenuItem value="nature">Nature</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 距離入力 */}
                    <TextField
                        label="Max Distance"
                        placeholder="0"
                        type="number"
                        size="small"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        sx={{
                            width: { xs: 200, md: 220 },
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'var(--background-0)',
                                borderRadius: 1,
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HiArrowsRightLeft className={'w-4 h-4 text-foreground-1/70'} />
                                </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">km</InputAdornment>
                        }}
                        InputLabelProps={{ shrink: true }}
                    />

                    {/* 居住地・国フィルター */}
                    <FormControl size="small" sx={{ width: { xs: 200, md: 220 } }}>
                        <InputLabel id="resident-label" shrink>Resident Area</InputLabel>
                        <Select
                            labelId="resident-label"
                            value={resident}
                            label="Resident Area"
                            onChange={(e) => setResident(e.target.value as string)}
                            input={
                                <OutlinedInput
                                    notched
                                    sx={{
                                        backgroundColor: 'var(--background-0)',
                                        borderRadius: 4,
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '& fieldset': { border: 'none' },
                                        '&:hover fieldset': { border: 'none' },
                                        '&.Mui-focused fieldset': { border: 'none' }
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <HiGlobeAsiaAustralia className={'w-4 h-4 text-foreground-1/70'} />
                                        </InputAdornment>
                                    }
                                />
                            }
                        >
                            <MenuItem value="all">All Users</MenuItem>
                            <MenuItem value="my-area">My Region</MenuItem>
                            <MenuItem value="my-country">My Country</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 並べ替え */}
                    <FormControl size="small" sx={{ minWidth: { xs: 200, md: 220 }, marginLeft: 'auto' }}>
                        <InputLabel id="sort-label" shrink>Sort by</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sort}
                            label="Sort by"
                            onChange={(e) => setSort(e.target.value as string)}
                            input={
                                <OutlinedInput
                                    notched
                                    sx={{
                                        backgroundColor: 'var(--background-0)',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '& fieldset': { border: 'none' },
                                        '&:hover fieldset': { border: 'none' },
                                        '&.Mui-focused fieldset': { border: 'none' }
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <HiArrowsUpDown className={'w-4 h-4 text-foreground-1/70'} />
                                        </InputAdornment>
                                    }
                                />
                            }
                        >
                            <MenuItem value="likes">Most Liked</MenuItem>
                            <MenuItem value="views">Most Viewed</MenuItem>
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="oldest">Oldest First</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </Box>
    )
}
