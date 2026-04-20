'use client';

import { useRef, useState } from 'react';
import { Camera, ImagePlus, X, Upload } from 'lucide-react';
import { uploadSiteImage } from '@/lib/firebase/storage';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import type { SiteMedia } from '@/types/site';

interface SiteImageEditorProps {
  siteId: string;
  media: SiteMedia;
  hasGallery: boolean;
  /** Called with the patched media after a successful upload/remove */
  onChange: (media: SiteMedia) => void;
}

export function SiteImageEditor({ siteId, media, hasGallery, onChange }: SiteImageEditorProps) {
  const { user } = useAuth();
  const { error: showError, success } = useToast();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const uid = user?.uid;

  const upload = async (file: File, type: 'logo' | 'hero' | 'gallery') => {
    if (!uid) return;
    setUploading((u) => ({ ...u, [type]: true }));
    try {
      const url = await uploadSiteImage(uid, siteId, type, file);
      const next: SiteMedia =
        type === 'gallery'
          ? { ...media, galleryUrls: [...(media.galleryUrls ?? []), url] }
          : { ...media, [`${type}Url`]: url };

      // Persist immediately via PATCH
      await fetch(`/api/sites/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: { media: next } }),
      });
      onChange(next);
      success('תמונה עודכנה', '');
    } catch (e: unknown) {
      showError('העלאה נכשלה', e instanceof Error ? e.message : 'נסה שנית');
    } finally {
      setUploading((u) => ({ ...u, [type]: false }));
    }
  };

  const removeGallery = async (url: string) => {
    const next: SiteMedia = {
      ...media,
      galleryUrls: media.galleryUrls?.filter((u) => u !== url),
    };
    await fetch(`/api/sites/${siteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { media: next } }),
    });
    onChange(next);
  };

  const removeField = async (field: 'logoUrl' | 'heroImageUrl') => {
    const next: SiteMedia = { ...media, [field]: undefined };
    await fetch(`/api/sites/${siteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { media: next } }),
    });
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">תמונות</h3>

      {/* Logo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">לוגו</label>
        {media.logoUrl ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.logoUrl}
              alt="Logo"
              className="h-14 w-14 rounded-xl object-contain bg-white/5 border border-white/10"
            />
            <div className="flex gap-2">
              <button
                onClick={() => logoRef.current?.click()}
                disabled={uploading.logo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/6 transition-all disabled:opacity-40"
              >
                <Camera size={12} />
                החלף
              </button>
              <button
                onClick={() => removeField('logoUrl')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all"
              >
                <X size={12} />
                הסר
              </button>
            </div>
          </div>
        ) : (
          <UploadButton loading={uploading.logo} onClick={() => logoRef.current?.click()} label="העלה לוגו" />
        )}
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'logo')}
        />
      </div>

      {/* Hero image */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">תמונת רקע (Hero)</label>
        {media.heroImageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.heroImageUrl}
              alt="Hero"
              className="w-full h-36 rounded-xl object-cover border border-white/10"
            />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                onClick={() => heroRef.current?.click()}
                disabled={uploading.hero}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-40"
              >
                <Camera size={12} />
                החלף
              </button>
              <button
                onClick={() => removeField('heroImageUrl')}
                className="flex items-center p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <UploadButton loading={uploading.hero} onClick={() => heroRef.current?.click()} label="העלה תמונת רקע" />
        )}
        <input
          ref={heroRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'hero')}
        />
      </div>

      {/* Gallery */}
      {hasGallery && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">
            גלריה <span className="text-white/30">({media.galleryUrls?.length ?? 0}/12)</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(media.galleryUrls ?? []).map((url) => (
              <div key={url} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full rounded-xl object-cover border border-white/10" />
                <button
                  onClick={() => removeGallery(url)}
                  className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            {(media.galleryUrls?.length ?? 0) < 12 && (
              <button
                onClick={() => galleryRef.current?.click()}
                disabled={uploading.gallery}
                className={cn(
                  'aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1',
                  'hover:border-indigo-500/40 hover:bg-white/3 transition-all disabled:opacity-40'
                )}
              >
                {uploading.gallery ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                ) : (
                  <ImagePlus size={16} className="text-white/30" />
                )}
                <span className="text-[10px] text-white/30">הוסף</span>
              </button>
            )}
          </div>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []).slice(0, 12 - (media.galleryUrls?.length ?? 0));
              files.forEach((f) => upload(f, 'gallery'));
            }}
          />
        </div>
      )}
    </div>
  );
}

function UploadButton({ loading, onClick, label }: { loading: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 bg-white/3',
        'text-sm text-white/40 hover:text-white/70 hover:border-white/25 hover:bg-white/5',
        'transition-all disabled:opacity-40'
      )}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      ) : (
        <Upload size={14} />
      )}
      {loading ? 'מעלה...' : label}
    </button>
  );
}
