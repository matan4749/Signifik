'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { Upload, X } from 'lucide-react';
import { uploadSiteImage } from '@/lib/firebase/storage';
import type { SiteMedia } from '@/types/site';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/components/ui/Toast';
import { useLang } from '@/lib/i18n/context';

interface Props {
  uid: string;
  siteId: string;
  media: SiteMedia;
  hasGallery: boolean;
  onSubmit: (media: SiteMedia) => void;
}

export function Step4_Media({ uid, siteId, media: initMedia, hasGallery, onSubmit }: Props) {
  const [media, setMedia] = useState<SiteMedia>(initMedia);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useToast();
  const { t } = useLang();

  const handleUpload = async (
    file: File,
    type: 'logo' | 'hero' | 'gallery'
  ) => {
    setUploading((u) => ({ ...u, [type]: true }));
    try {
      const url = await uploadSiteImage(uid, siteId, type, file);
      if (type === 'gallery') {
        setMedia((m) => ({ ...m, galleryUrls: [...(m.galleryUrls || []), url] }));
      } else {
        setMedia((m) => ({ ...m, [`${type}Url`]: url }));
      }
    } catch (e: unknown) {
      showError(t.step4_upload_failed, e instanceof Error ? e.message : 'Try again');
    } finally {
      setUploading((u) => ({ ...u, [type]: false }));
    }
  };

  const removeGalleryImage = (url: string) => {
    setMedia((m) => ({ ...m, galleryUrls: m.galleryUrls?.filter((u) => u !== url) }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.step4_title}</h2>
        <p className="text-white/40">{t.step4_sub}</p>
      </div>

      <Card className="space-y-6">
        {/* Logo */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-3">{t.step4_logo}</label>
          {media.logoUrl ? (
            <div className="flex items-center gap-3">
              <img src={media.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-contain bg-white/5 border border-white/10" />
              <Button variant="ghost" size="sm" icon={<X size={14} />}
                onClick={() => setMedia((m) => ({ ...m, logoUrl: undefined }))}>
                {t.step4_logo_remove}
              </Button>
            </div>
          ) : (
            <UploadZone
              loading={uploading.logo}
              accept="image/*"
              hint={t.step4_logo_hint}
              uploadingText={t.step4_uploading}
              onClick={() => logoRef.current?.click()}
            />
          )}
          <input ref={logoRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
        </div>

        {/* Hero Image */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-3">{t.step4_hero_img}</label>
          {media.heroImageUrl ? (
            <div className="relative">
              <img src={media.heroImageUrl} alt="Hero" className="w-full h-40 rounded-xl object-cover border border-white/10" />
              <button
                className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                onClick={() => setMedia((m) => ({ ...m, heroImageUrl: undefined }))}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <UploadZone
              loading={uploading.hero}
              accept="image/*"
              hint={t.step4_hero_hint}
              uploadingText={t.step4_uploading}
              onClick={() => heroRef.current?.click()}
            />
          )}
          <input ref={heroRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'hero')} />
        </div>

        {/* Gallery */}
        {hasGallery && (
          <div>
            <label className="text-sm font-medium text-white/70 block mb-3">
              {t.step4_gallery} <span className="text-white/30">({media.galleryUrls?.length || 0}/12)</span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(media.galleryUrls || []).map((url) => (
                <div key={url} className="relative aspect-square">
                  <img src={url} alt="Gallery" className="w-full h-full rounded-xl object-cover border border-white/10" />
                  <button
                    className="absolute top-1 right-1 rounded-lg bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                    onClick={() => removeGalleryImage(url)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {(media.galleryUrls?.length || 0) < 12 && (
              <UploadZone
                loading={uploading.gallery}
                accept="image/*"
                hint={t.step4_gallery_add}
                uploadingText={t.step4_uploading}
                onClick={() => galleryRef.current?.click()}
                compact
              />
            )}
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 12 - (media.galleryUrls?.length || 0));
                files.forEach((f) => handleUpload(f, 'gallery'));
              }} />
          </div>
        )}
      </Card>

      <Button onClick={() => onSubmit(media)} size="lg" className="w-full">
        {t.step4_next}
      </Button>
    </div>
  );
}

interface UploadZoneProps {
  loading: boolean;
  accept: string;
  hint: string;
  uploadingText: string;
  onClick: () => void;
  compact?: boolean;
}

function UploadZone({ loading, hint, uploadingText, onClick, compact }: UploadZoneProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'w-full rounded-xl border-2 border-dashed border-white/10 bg-white/3',
        'flex flex-col items-center justify-center gap-2',
        'hover:border-indigo-500/40 hover:bg-white/5 transition-all duration-150',
        'disabled:opacity-50 disabled:pointer-events-none',
        compact ? 'py-4' : 'py-10'
      )}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      ) : (
        <Upload size={compact ? 16 : 24} className="text-white/30" />
      )}
      <span className="text-xs text-white/30">{loading ? uploadingText : hint}</span>
    </button>
  );
}
