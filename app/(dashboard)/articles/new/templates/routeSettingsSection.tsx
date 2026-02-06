"use client";

import { Image as ImageIcon, Loader2, MessageSquare, Tag, Globe, Lock } from "lucide-react";
import Image from "next/image";

interface RouteSettingsSectionProps {
    title: string;
    setTitle: (val: string) => void;
    bio: string;
    setBio: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    visibility: 'public' | 'private';
    setVisibility: (val: 'public' | 'private') => void;
    thumbnailImageSrc?: string;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
}

export default function RouteSettingsSection({
    title, setTitle,
    bio, setBio,
    category, setCategory,
    visibility, setVisibility,
    thumbnailImageSrc,
    handleImageUpload,
    uploading
}: RouteSettingsSectionProps) {
    return (
        <div className="w-full h-full flex-1 bg-background-1 p-10">
            <div className="max-w-3xl mx-auto space-y-12 pb-20">
                <div className="flex items-end justify-between border-b border-grass pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={18} className="text-accent-0" />
                            <span className="text-xs font-bold uppercase tracking-widest text-accent-0">
                                Route Settings
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-foreground-0 tracking-tight">
                            Publication Settings
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {/* Title */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                            Route Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-xl font-medium"
                            placeholder="Enter route title..."
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                            <MessageSquare size={16} /> Description
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl h-32 focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-base leading-relaxed resize-none"
                            placeholder="Short description of your route..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Category */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                                <Tag size={16} /> Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-base font-medium appearance-none"
                            >
                                <option value="General">General</option>
                                <option value="History">History</option>
                                <option value="Nature">Nature</option>
                                <option value="Culture">Culture</option>
                                <option value="Food">Food</option>
                                <option value="Activity">Activity</option>
                            </select>
                        </div>

                        {/* Visibility */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                                {visibility === 'public' ? <Globe size={16} /> : <Lock size={16} />} Visibility
                            </label>
                            <div className="flex bg-background-0 border border-grass rounded-2xl overflow-hidden p-1">
                                <button
                                    onClick={() => setVisibility('private')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${visibility === 'private' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    Private
                                </button>
                                <button
                                    onClick={() => setVisibility('public')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${visibility === 'public' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    Public
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                            <ImageIcon size={16} /> Thumbnail
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="thumbnail-upload-section"
                            onChange={handleImageUpload}
                        />
                        <div
                            className="group relative border-2 border-dashed border-grass rounded-3xl p-10 flex flex-col items-center justify-center text-foreground-1 hover:bg-background-0 hover:border-accent-0/30 cursor-pointer transition-all min-h-[240px] overflow-hidden"
                            onClick={() => document.getElementById('thumbnail-upload-section')?.click()}
                        >
                            {thumbnailImageSrc ? (
                                <>
                                    <div className="absolute inset-0">
                                        <Image
                                            src={thumbnailImageSrc}
                                            alt="Thumbnail preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                                            Change Image
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-grass rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        {uploading ? <Loader2 className="animate-spin text-foreground-1" size={28} /> : <ImageIcon size={32} className="text-foreground-1" />}
                                    </div>
                                    <span className="font-bold">Add Thumbnail</span>
                                    <span className="text-xs text-foreground-1/60 mt-1">Recommended: 16:9 ratio</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
