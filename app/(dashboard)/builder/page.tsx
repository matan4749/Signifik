'use client';

import { useRouter } from 'next/navigation';
import { WizardShell } from '@/components/builder/WizardShell';
import { Step1_BasicInfo } from '@/components/builder/steps/Step1_BasicInfo';
import { Step2_Design } from '@/components/builder/steps/Step2_Design';
import { Step3_Content } from '@/components/builder/steps/Step3_Content';
import { Step4_Media } from '@/components/builder/steps/Step4_Media';
import { Step5_Domain } from '@/components/builder/steps/Step5_Domain';
import { Step6_Review } from '@/components/builder/steps/Step6_Review';
import { DeployProgress } from '@/components/builder/DeployProgress';
import { useBuilderState } from '@/hooks/useBuilderState';
import { useDeployStatus } from '@/hooks/useDeployStatus';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

export default function BuilderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { error } = useToast();
  const {
    state,
    nextStep, prevStep, goToStep,
    setBusinessInfo, setDesign, toggleComponent, setContact, setHero, setMedia, setSEO, setSlug, setCustomDomain,
    setSubmitting, setDeployed,
  } = useBuilderState();

  const { site, status, errorMessage } = useDeployStatus(state.deployedSiteId);

  // Show deploy progress screen once deployment starts
  if (state.deployedSiteId) {
    return (
      <DeployProgress
        status={status}
        url={site?.deployment?.url}
        errorMessage={errorMessage}
        onGoToDashboard={() => router.push('/dashboard')}
      />
    );
  }

  const handleDeploy = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: state.config,
          slug: state.slug,
          customDomain: state.customDomain,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        error('פריסה נכשלה', data.error || 'נסה שנית');
        return;
      }

      setDeployed(data.siteId);
    } catch {
      error('פריסה נכשלה', 'שגיאת רשת. נסה שנית.');
    } finally {
      setSubmitting(false);
    }
  };

  const uid = user?.uid || '';
  // Temporary site ID for media uploads during wizard (use a draft prefix)
  const draftSiteId = `draft-${uid}`;

  return (
    <WizardShell currentStep={state.step} onBack={prevStep} onGoToStep={goToStep}>
      {state.step === 1 && (
        <Step1_BasicInfo
          businessName={state.config.businessName}
          tagline={state.config.tagline}
          niche={state.config.niche}
          onSubmit={(businessName, tagline, niche, slug) => {
            setBusinessInfo(businessName, tagline, niche);
            setSlug(slug);
            nextStep();
          }}
        />
      )}
      {state.step === 2 && (
        <Step2_Design
          design={state.config.design}
          onSubmit={(design) => {
            setDesign(design);
            nextStep();
          }}
        />
      )}
      {state.step === 3 && (
        <Step3_Content
          hero={state.config.hero}
          components={state.config.components}
          contact={state.config.contact}
          onSubmit={(hero, components, contact) => {
            setHero(hero);
            components.forEach((c) => {
              if (!state.config.components.includes(c)) toggleComponent(c);
            });
            state.config.components.forEach((c) => {
              if (!components.includes(c)) toggleComponent(c);
            });
            setContact(contact);
            nextStep();
          }}
        />
      )}
      {state.step === 4 && (
        <Step4_Media
          uid={uid}
          siteId={draftSiteId}
          media={state.config.media}
          hasGallery={state.config.components.includes('image-gallery')}
          onSubmit={(media) => {
            setMedia(media);
            nextStep();
          }}
        />
      )}
      {state.step === 5 && (
        <Step5_Domain
          slug={state.slug}
          onSubmit={(slug, customDomain) => {
            setSlug(slug);
            setCustomDomain(customDomain);
            nextStep();
          }}
        />
      )}
      {state.step === 6 && (
        <Step6_Review
          config={state.config}
          slug={state.slug}
          customDomain={state.customDomain}
          isSubmitting={state.isSubmitting}
          onDeploy={handleDeploy}
        />
      )}
    </WizardShell>
  );
}
export const dynamic = 'force-dynamic';
