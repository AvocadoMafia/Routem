"use client";

import { Image as ImageIcon, Loader2, MessageSquare, Tag, Globe, Lock, Users, Link, Copy, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import {Category} from "@/lib/client/types";
import {categoryStore} from "@/lib/client/stores/categoryStore";
import { useState } from "react";

interface RouteSettingsSectionProps {
    title: string;
    setTitle: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    category: Category;
    setCategory: (val: Category) => void;
    visibility: 'PUBLIC' | 'PRIVATE';
    setVisibility: (val: 'PUBLIC' | 'PRIVATE') => void;
    collaboratorPolicy: 'DISABLED' | 'VIEW_ONLY' | 'CAN_EDIT';
    setCollaboratorPolicy: (val: 'DISABLED' | 'VIEW_ONLY' | 'CAN_EDIT') => void;
    routeId?: string; // 編集時のみ存在
    thumbnailImageSrc?: string;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
}

export default function RouteSettingsSection({
    title, setTitle,
    description, setDescription,
    category, setCategory,
    visibility, setVisibility,
    collaboratorPolicy, setCollaboratorPolicy,
    routeId,
    thumbnailImageSrc,
    handleImageUpload,
    uploading
}: RouteSettingsSectionProps) {

    const categories = categoryStore((state) => state.categories);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerateInvite = async () => {
        if (!routeId) return;
        setGenerating(true);
        try {
            const res = await fetch(`/api/v1/routes/${routeId}/invite`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                const url = `${window.location.origin}/invites/${data.token}`;
                setInviteUrl(url);
            } else {
                alert(data.message || 'Failed to generate invite URL');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!inviteUrl) return;
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                                value={category.id}
                                onChange={(e) => setCategory(categories.find((cat ) => cat.id === e.target.value) || { id: '', name: ''})}
                                className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-base font-medium appearance-none"
                            >
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Visibility */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                                {visibility === 'PUBLIC' ? <Globe size={16} /> : <Lock size={16} />} Visibility
                            </label>
                            <div className="flex bg-background-0 border border-grass rounded-2xl overflow-hidden p-1">
                                <button
                                    onClick={() => setVisibility('PRIVATE')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${visibility === 'PRIVATE' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    Private
                                </button>
                                <button
                                    onClick={() => setVisibility('PUBLIC')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${visibility === 'PUBLIC' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    Public
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        {/* Collaborator Policy */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                                <Users size={16} /> Collaborator Policy
                            </label>
                            <div className="grid grid-cols-3 bg-background-0 border border-grass rounded-2xl overflow-hidden p-1">
                                <button
                                    onClick={() => setCollaboratorPolicy('DISABLED')}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${collaboratorPolicy === 'DISABLED' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    Disabled
                                </button>
                                <button
                                    onClick={() => setCollaboratorPolicy('VIEW_ONLY')}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${collaboratorPolicy === 'VIEW_ONLY' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    View Only
                                </button>
                                <button
                                    onClick={() => setCollaboratorPolicy('CAN_EDIT')}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${collaboratorPolicy === 'CAN_EDIT' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                                >
                                    Can Edit
                                </button>
                            </div>
                            <p className="text-xs text-foreground-1/60 px-1">
                                {collaboratorPolicy === 'DISABLED' && "Collaboration is disabled."}
                                {collaboratorPolicy === 'VIEW_ONLY' && "Collaborators can view this route even if it is private."}
                                {collaboratorPolicy === 'CAN_EDIT' && "Collaborators can view and edit this route."}
                            </p>
                        </div>

                        {/* Invite URL (Only for existing routes and if not disabled) */}
                        {routeId && collaboratorPolicy !== 'DISABLED' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                                    <Link size={16} /> Invitation URL
                                </label>
                                <div className="flex gap-3">
                                    {inviteUrl ? (
                                        <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-background-0 border border-grass rounded-2xl">
                                            <span className="flex-1 text-sm font-medium truncate text-foreground-1">
                                                {inviteUrl}
                                            </span>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-2 text-accent-0 hover:bg-accent-0/10 rounded-xl transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleGenerateInvite}
                                            disabled={generating}
                                            className="flex-1 px-5 py-4 bg-accent-0 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-0/90 transition-all disabled:opacity-50"
                                        >
                                            {generating ? <Loader2 size={20} className="animate-spin" /> : <Link size={20} />}
                                            Generate Invitation URL
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {!routeId && collaboratorPolicy !== 'DISABLED' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                                    <Link size={16} /> Invitation URL
                                </label>
                                <div className="px-5 py-4 bg-background-0 border border-grass border-dashed rounded-2xl flex items-center gap-3">
                                    <AlertCircle size={18} className="text-foreground-1/40" />
                                    <p className="text-sm text-foreground-1/60 font-medium">
                                        Invitation URLs can be generated after saving the route.
                                    </p>
                                </div>
                            </div>
                        )}
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
