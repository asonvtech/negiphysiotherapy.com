import { FormEvent, useEffect, useMemo } from 'react';
import sampleHtml from '../../sample.html?raw';
import { ClinicFooter } from '../components/clinic/ClinicFooter';
import { ClinicMainContent } from '../components/clinic/ClinicMainContent';
import { ClinicNavbar } from '../components/clinic/ClinicNavbar';
import { FloatingWhatsAppButton } from '../components/clinic/FloatingWhatsAppButton';

declare global {
  interface Window {
    Swiper?: new (element: Element, options: Record<string, unknown>) => {
      destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
    };
    lucide?: {
      createIcons: () => void;
    };
  }
}

type ParsedClinicMarkup = {
  styleText: string;
  floatingHtml: string;
  headerHtml: string;
  mainHtml: string;
  footerHtml: string;
};

const normalizeMarkup = (html: string) =>
  html
    .replaceAll('./public/images/', '/images/')
    .replaceAll('"./public/images/', '"/images/')
    .replaceAll("'./public/images/", "'/images/");

const treatmentRichContent: Record<string, { highlights: string[]; readMore: string }> = {
  'Short Wave Diathermy (SWD)': {
    highlights: ['Deep heat for chronic stiffness and muscle spasm', 'Improves circulation before stretching and mobilization'],
    readMore:
      'SWD delivers deep therapeutic heat in tissues to reduce chronic pain, stiffness, and protective muscle guarding. It is especially useful before manual therapy and mobility drills because warm tissues respond better to stretching and joint movement.',
  },
  'Long Wave Diathermy (LWD)': {
    highlights: ['Comfortable thermal pain-relief modality', 'Supports soft tissue relaxation and pre-exercise readiness'],
    readMore:
      'LWD provides gentle, well-tolerated heat for painful regions where tissue irritability is high. It helps reduce discomfort, improves local blood flow, and prepares muscles and fascia for active rehabilitation sessions.',
  },
  'Ultrasound Therapy (UST)': {
    highlights: ['Helpful in tendinopathy and scar tissue restrictions', 'Promotes tissue healing with stage-specific dosage'],
    readMore:
      'UST uses therapeutic sound waves to support repair of tendons, ligaments, and soft tissues. Pulsed or continuous modes are selected as per healing stage so inflammation control and tissue remodeling are both addressed safely.',
  },
  'Wax Therapy': {
    highlights: ['Excellent for hand and wrist joint stiffness', 'Improves comfort before active hand exercises'],
    readMore:
      'Paraffin wax heat offers uniform warmth for small joints affected by stiffness and pain, especially after immobilization. It helps reduce movement discomfort and improves range before grip and dexterity exercises.',
  },
  'Electrical Muscle Stimulation': {
    highlights: ['Re-educates weak or inhibited muscles', 'Combines well with voluntary strengthening drills'],
    readMore:
      'EMS activates targeted muscles with controlled electrical impulses when natural contraction is weak after injury or surgery. This improves recruitment quality and supports faster transition to functional movement training.',
  },
  TENS: {
    highlights: ['Non-invasive pain gate modulation', 'Useful for neck, back, and joint pain episodes'],
    readMore:
      'TENS reduces pain signaling and provides temporary relief, making it easier for patients to move and exercise. Frequency and intensity are customized to ensure comfort while maximizing analgesic benefit.',
  },
  'Advanced Laser Therapy (Class IV, European CE Certified)': {
    highlights: ['High-intensity photobiomodulation support', 'Helps reduce inflammation and persistent pain'],
    readMore:
      'Class IV laser therapy targets deeper tissues to improve cellular healing response in chronic and overuse injuries. It is commonly integrated with manual and exercise therapy for better pain and recovery outcomes.',
  },
  'Hot & Cold Therapy': {
    highlights: ['Cold for acute swelling and irritation', 'Heat for chronic tightness and mobility improvement'],
    readMore:
      'Thermal therapy is selected according to tissue stage: cold in acute phases and heat in subacute/chronic phases. Correct timing and dosage help manage pain while protecting healing tissues from overload.',
  },
  'Interferential Therapy (IFT)': {
    highlights: ['Comfortable stimulation for deeper pain zones', 'Supports edema control and pain reduction'],
    readMore:
      'IFT uses intersecting medium-frequency currents to treat painful musculoskeletal regions with better comfort. It is frequently used in back, shoulder, and post-injury conditions to improve tolerance for movement therapy.',
  },
  'Exercise Therapy': {
    highlights: ['Core element of long-term recovery', 'Progressive strengthening, mobility, and function drills'],
    readMore:
      'Exercise therapy is individualized by pain level, movement quality, and recovery goals. Programs progress through controlled stages to rebuild strength, endurance, balance, and confidence in daily activities.',
  },
  'Cervical & Lumbar Traction': {
    highlights: ['Selective decompression for radicular symptoms', 'Combined with posture and stabilization rehab'],
    readMore:
      'Traction is used in carefully selected cases to reduce compressive load over cervical or lumbar segments. It can ease nerve-related symptoms and is paired with core/neck stabilization for sustained results.',
  },
  'Frozen Shoulder': {
    highlights: ['Phase-wise mobility restoration protocol', 'Pain control with capsule-focused manual work'],
    readMore:
      'Frozen shoulder rehab addresses pain phase, stiffness phase, and recovery phase with structured progression. Gentle mobilization, stretching, and strengthening restore functional shoulder movement safely.',
  },
  'Cervical Pain & Vertigo': {
    highlights: ['Deep neck stabilization and posture correction', 'Vestibular retraining for dizziness control'],
    readMore:
      'Treatment combines cervical manual therapy with vestibular and gaze stabilization drills to reduce dizziness triggers. It also improves neck endurance and head-neck control for better daily comfort.',
  },
  'Low Back Pain (Slip Disc)': {
    highlights: ['Core control and movement pattern correction', 'Graded return to work and activity'],
    readMore:
      'Rehab focuses on pain calming, lumbar protection strategies, and progressive core strengthening. Patients are guided on sitting, lifting, and bending mechanics to reduce recurrence risk long-term.',
  },
  'Arthritis (Knee / Hip Pain)': {
    highlights: ['Joint-friendly strength and gait training', 'Improves walking tolerance and day-to-day function'],
    readMore:
      'Arthritis programs include low-impact strengthening, mobility routines, and load-management education. The goal is to decrease pain flare frequency and improve independence in daily movement.',
  },
  'Post Fracture Rehabilitation': {
    highlights: ['Progress from ROM recovery to strength', 'Confidence rebuilding for weight-bearing and function'],
    readMore:
      'This pathway starts with stiffness and swelling management, then advances into controlled loading and functional retraining. Plans are customized by fracture location, fixation method, and healing timelines.',
  },
  'Tennis Elbow': {
    highlights: ['Tendon-loading progression with pain monitoring', 'Grip and forearm conditioning with ergonomic correction'],
    readMore:
      'Tennis elbow rehab emphasizes progressive extensor tendon loading and activity modification. It improves tissue capacity and reduces repetitive overload from work, household, or sport tasks.',
  },
  'Paralysis / Cerebral Palsy / Polio': {
    highlights: ['Neurofacilitation for trunk and limb control', 'ADL and gait-focused functional training'],
    readMore:
      'Neurological rehabilitation is tailored to movement quality, balance, tone, and functional goals. It includes caregiver guidance, safety training, and daily-living integration for meaningful independence.',
  },
  'Total Knee Replacement': {
    highlights: ['Early swelling control and ROM milestones', 'Quadriceps activation and gait normalization'],
    readMore:
      'TKR rehab begins with pain and edema control, extension recovery, and safe walking training. Later phases target stair climbing, endurance, and functional strength for active community mobility.',
  },
  'Total Hip Replacement': {
    highlights: ['Safe mobility with post-op precautions', 'Hip stability and glute strengthening progression'],
    readMore:
      'THR rehabilitation focuses on transfer safety, gait correction, and gradual hip strengthening while respecting surgical precautions. Functional progression is designed for stable and confident movement.',
  },
  'Ligament Reconstruction': {
    highlights: ['Criterion-based progression across healing phases', 'Strength symmetry and neuromuscular readiness'],
    readMore:
      'Rehab follows milestone-based criteria rather than only time, improving return-to-activity safety. It includes controlled loading, dynamic stability, and task-specific drills before clearance.',
  },
  'Spinal Surgery Recovery': {
    highlights: ['Protected movement with surgeon precautions', 'Core reconditioning and posture retraining'],
    readMore:
      'This program is aligned with surgical guidelines and healing stages to restore function safely. It emphasizes movement confidence, trunk stability, and gradual return to daily routines without overload.',
  },
  'Chiropractic Adjustment (Cervical & Lumbar Spine)': {
    highlights: ['Segment-focused cervical and lumbar mobility support', 'Integrated with posture and stabilization rehab'],
    readMore:
      'Chiropractic adjustments are used in selected cases to improve spinal joint motion and reduce stiffness. Sessions are paired with corrective exercise and ergonomic guidance for sustained outcomes.',
  },
  'Dry Needling & Kinesiology Taping (Sports Injuries)': {
    highlights: ['Trigger-point release for sports overload pain', 'Movement-support taping during rehab progression'],
    readMore:
      'Dry needling targets irritable myofascial points while kinesiology taping supports controlled movement and load distribution. Together, they help athletes recover and return to activity safely.',
  },
  'Dry & Wet Cupping Therapy': {
    highlights: ['Soft tissue decompression and circulation support', 'Useful for relaxation and muscle repair pathways'],
    readMore:
      'Cupping therapy is selected as per tissue response and recovery goals to reduce tightness and improve local perfusion. It can complement manual therapy and movement retraining for better comfort.',
  },
  'Instrument-Assisted Soft Tissue Mobilization (IASTM)': {
    highlights: ['Instrument-guided fascial and scar mobility work', 'Supports range restoration and tissue glide quality'],
    readMore:
      'IASTM uses precision tools to mobilize restricted soft tissues and support better movement mechanics. Instrument-diagram guidance is used to educate patients about target tissues and treatment progression.',
  },
  'Geriatric Physiotherapy (Old Age Patients)': {
    highlights: ['Balance and fall-prevention focused programming', 'ADL-friendly mobility and strength progression'],
    readMore:
      'Geriatric physiotherapy addresses age-related weakness, stiffness, and confidence loss through safe progression. Diagram-supported home guidance helps patients and caregivers continue therapy effectively.',
  },
};

const treatmentBestFor: Record<string, string[]> = {
  'Short Wave Diathermy (SWD)': ['Chronic low back pain', 'Joint stiffness', 'Muscle spasm'],
  'Long Wave Diathermy (LWD)': ['Soft tissue tightness', 'Persistent ache', 'Pre-exercise warmup'],
  'Ultrasound Therapy (UST)': ['Tendinitis', 'Ligament strain', 'Scar adhesions'],
  'Wax Therapy': ['Hand stiffness', 'Wrist pain', 'Small joint arthritis'],
  'Electrical Muscle Stimulation': ['Post-surgery weakness', 'Muscle inhibition', 'Motor re-education'],
  TENS: ['Neck pain', 'Back pain', 'Joint discomfort'],
  'Advanced Laser Therapy (Class IV, European CE Certified)': ['Inflammatory pain', 'Tendon overload', 'Chronic injuries'],
  'Hot & Cold Therapy': ['Acute swelling', 'Delayed soreness', 'Chronic stiffness'],
  'Interferential Therapy (IFT)': ['Deep musculoskeletal pain', 'Edema control', 'Post-injury pain'],
  'Exercise Therapy': ['Strength deficit', 'Mobility loss', 'Functional recovery'],
  'Cervical & Lumbar Traction': ['Radicular pain', 'Disc-related symptoms', 'Nerve compression signs'],
  'Frozen Shoulder': ['Shoulder stiffness', 'Painful ROM', 'Capsular tightness'],
  'Cervical Pain & Vertigo': ['Cervicogenic dizziness', 'Neck strain', 'Postural imbalance'],
  'Low Back Pain (Slip Disc)': ['Slip disc pain', 'Core weakness', 'Movement fear'],
  'Arthritis (Knee / Hip Pain)': ['Knee OA pain', 'Hip OA stiffness', 'Reduced walking tolerance'],
  'Post Fracture Rehabilitation': ['Post-cast stiffness', 'Weakness after fracture', 'Gait confidence loss'],
  'Tennis Elbow': ['Lateral elbow pain', 'Grip weakness', 'Repetitive strain'],
  'Paralysis / Cerebral Palsy / Polio': ['Gait deficits', 'ADL limitations', 'Trunk control issues'],
  'Total Knee Replacement': ['Post-op knee rehab', 'ROM recovery', 'Quadriceps reactivation'],
  'Total Hip Replacement': ['Post-op hip rehab', 'Balance retraining', 'Safe mobility progression'],
  'Ligament Reconstruction': ['Post-ACL rehab', 'Joint instability', 'Return-to-sport prep'],
  'Spinal Surgery Recovery': ['Post-spine surgery', 'Core reconditioning', 'Safe return to activity'],
  'Chiropractic Adjustment (Cervical & Lumbar Spine)': ['Cervical stiffness', 'Lumbar restriction', 'Spinal mobility support'],
  'Dry Needling & Kinesiology Taping (Sports Injuries)': ['Sports overload pain', 'Trigger-point symptoms', 'Return-to-play support'],
  'Dry & Wet Cupping Therapy': ['Muscle tightness', 'Recovery fatigue', 'Relaxation-focused care'],
  'Instrument-Assisted Soft Tissue Mobilization (IASTM)': ['Fascial restriction', 'Scar tissue tightness', 'Movement quality deficits'],
  'Geriatric Physiotherapy (Old Age Patients)': ['Balance decline', 'Fall-risk reduction', 'Mobility in older adults'],
};

function loadExternalScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

function parseClinicHtml(html: string): ParsedClinicMarkup {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const styleText = doc.querySelector('head style')?.textContent ?? '';
  const floatingHtml = normalizeMarkup(doc.body.querySelector('a[aria-label="Chat on WhatsApp"]')?.outerHTML ?? '');
  const headerHtml = normalizeMarkup(doc.body.querySelector('header')?.outerHTML ?? '');
  const mainHtml = normalizeMarkup(doc.body.querySelector('main')?.outerHTML ?? '');
  const footerHtml = normalizeMarkup(doc.body.querySelector('footer')?.outerHTML ?? '');

  return {
    styleText,
    floatingHtml,
    headerHtml,
    mainHtml,
    footerHtml,
  };
}

export function ClinicLandingPage() {
  const markup = useMemo(() => parseClinicHtml(sampleHtml), []);

  useEffect(() => {
    document.title = 'Negi Physiotherapy Clinic – Ortho & Neuro Rehab Center';

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        'content',
        'Negi Physiotherapy Clinic – Ortho & Neuro Rehab Center offers expert pain relief, neuro and orthopedic rehabilitation, home physiotherapy, and personalized recovery plans.',
      );
    }

    let swiperInstance: { destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void } | null = null;
    const cleanup: Array<() => void> = [];

    const initializeInteractions = async () => {
      try {
        await Promise.all([
          loadExternalScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'),
          loadExternalScript('https://unpkg.com/lucide@latest'),
        ]);
      } catch {
        // Keep page interactive even if CDN scripts fail.
      }

      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }

      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      const mobileNavMenu = document.getElementById('mobile-nav-menu');

      if (mobileMenuToggle && mobileNavMenu) {
        const mobileNavLinks = mobileNavMenu.querySelectorAll('a');

        const closeMobileMenu = () => {
          mobileNavMenu.classList.add('hidden');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        };

        const handleToggleMenu = () => {
          const isOpen = !mobileNavMenu.classList.contains('hidden');
          if (isOpen) {
            closeMobileMenu();
          } else {
            mobileNavMenu.classList.remove('hidden');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
          }
        };

        const handleResize = () => {
          if (window.innerWidth >= 768) {
            closeMobileMenu();
          }
        };

        mobileMenuToggle.addEventListener('click', handleToggleMenu);
        mobileNavLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
        window.addEventListener('resize', handleResize);

        cleanup.push(() => {
          mobileMenuToggle.removeEventListener('click', handleToggleMenu);
          mobileNavLinks.forEach((link) => link.removeEventListener('click', closeMobileMenu));
          window.removeEventListener('resize', handleResize);
        });
      }

      const testimonialsSwiperEl = document.querySelector('.testimonial-swiper');
      if (testimonialsSwiperEl && window.Swiper) {
        swiperInstance = new window.Swiper(testimonialsSwiperEl, {
          loop: true,
          speed: 900,
          spaceBetween: 20,
          autoplay: {
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          slidesPerView: 1.1,
          grabCursor: true,
          pagination: {
            el: '.testimonial-swiper .swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.testimonial-swiper .swiper-button-next',
            prevEl: '.testimonial-swiper .swiper-button-prev',
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          },
        });
      }

      const revealElements = document.querySelectorAll<HTMLElement>('.reveal');
      revealElements.forEach((el, index) => {
        const delay = Math.min(index * 40, 220);
        el.style.setProperty('--reveal-delay', `${delay}ms`);
        el.classList.add('visible');
      });

      const treatmentItems = document.querySelectorAll<HTMLElement>('.treatment-item');
      treatmentItems.forEach((item) => {
        const titleEl = item.querySelector<HTMLHeadingElement>('h4');
        if (!titleEl) return;

        const title = titleEl.textContent?.trim() ?? '';
        const data = treatmentRichContent[title];
        if (!data) return;

        const descriptionEl = item.querySelector<HTMLParagraphElement>('p');
        const readMoreContent = item.querySelector<HTMLElement>('.read-more-content');

        if (readMoreContent) {
          readMoreContent.textContent = data.readMore;
        }

        const existingHighlights = item.querySelector('.treatment-highlights');
        if (!existingHighlights && descriptionEl) {
          const highlightsEl = document.createElement('ul');
          highlightsEl.className = 'theme-list treatment-highlights mt-2 grid gap-1 text-xs text-slate-600';

          data.highlights.forEach((highlight) => {
            const li = document.createElement('li');
            li.textContent = highlight;
            highlightsEl.appendChild(li);
          });

          descriptionEl.insertAdjacentElement('afterend', highlightsEl);
        }

        const existingMeta = item.querySelector('.treatment-meta');
        if (!existingMeta && descriptionEl) {
          const bestForTags = treatmentBestFor[title] || ['Pain reduction', 'Mobility improvement', 'Function restoration'];

          const sectionHeading = item.closest('details.section-accordion')?.querySelector('summary h3')?.textContent || '';
          const isElectroSection = sectionHeading.includes('Electrotherapy');

          const sessionFocus = isElectroSection
            ? 'Session focus: symptom assessment → targeted modality dose → response check → exercise carryover.'
            : 'Session focus: phase-wise rehab goals → supervised drills → movement correction → home progression.';

          const expectedOutcome = isElectroSection
            ? 'Expected outcome: pain reduction, tissue relaxation, and better tolerance for active rehabilitation.'
            : 'Expected outcome: improved daily function, stronger movement control, and safer long-term recovery.';

          const metaWrap = document.createElement('div');
          metaWrap.className = 'treatment-meta mt-3 space-y-2';

          const tagsWrap = document.createElement('div');
          tagsWrap.className = 'flex flex-wrap gap-1.5';

          bestForTags.forEach((tag) => {
            const chip = document.createElement('span');
            chip.className = 'inline-flex rounded-full border border-medicalBlue/20 bg-medicalIce px-2 py-1 text-[10px] font-semibold text-medicalBlue';
            chip.textContent = tag;
            tagsWrap.appendChild(chip);
          });

          const bestForLabel = document.createElement('p');
          bestForLabel.className = 'text-[11px] font-semibold text-slate-700';
          bestForLabel.textContent = 'Best for:';

          const focusLine = document.createElement('p');
          focusLine.className = 'text-[11px] leading-5 text-slate-600';
          focusLine.textContent = sessionFocus;

          const outcomeLine = document.createElement('p');
          outcomeLine.className = 'text-[11px] leading-5 text-slate-600';
          outcomeLine.textContent = expectedOutcome;

          metaWrap.appendChild(bestForLabel);
          metaWrap.appendChild(tagsWrap);
          metaWrap.appendChild(focusLine);
          metaWrap.appendChild(outcomeLine);

          const readMoreBlock = item.querySelector('details.read-more');
          if (readMoreBlock) {
            readMoreBlock.insertAdjacentElement('beforebegin', metaWrap);
          } else {
            descriptionEl.insertAdjacentElement('afterend', metaWrap);
          }
        }
      });

      const readMoreBlocks = document.querySelectorAll<HTMLDetailsElement>('details.read-more');
      readMoreBlocks.forEach((block) => {
        const summary = block.querySelector('summary');
        const content = block.querySelector('.read-more-content');
        if (!summary) return;

        summary.textContent = 'Read more';
        if (!content) return;

        let readLessBtn = block.querySelector<HTMLButtonElement>('.read-less-btn');
        if (!readLessBtn) {
          readLessBtn = document.createElement('button');
          readLessBtn.type = 'button';
          readLessBtn.className = 'read-less-btn';
          readLessBtn.textContent = 'Read less';
          content.insertAdjacentElement('afterend', readLessBtn);
        }

        const handleReadLess = () => {
          block.open = false;
        };

        readLessBtn.addEventListener('click', handleReadLess);
        cleanup.push(() => {
          readLessBtn?.removeEventListener('click', handleReadLess);
        });
      });

      const form = document.getElementById('request-appointment-form') as HTMLFormElement | null;
      const nameInput = document.getElementById('name') as HTMLInputElement | null;
      const phoneInput = document.getElementById('phone') as HTMLInputElement | null;
      const problemInput = document.getElementById('problem') as HTMLTextAreaElement | null;

      if (form) {
        form.removeAttribute('onsubmit');

        const onSubmit = (event: FormEvent<HTMLFormElement> | Event) => {
          event.preventDefault();

          const name = nameInput?.value?.trim() || '';
          const phone = phoneInput?.value?.trim() || '';
          const problem = problemInput?.value?.trim() || '';

          if (!name || !phone || !problem) {
            form.reportValidity();
            return;
          }

          const now = new Date();
          const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
          const randomPart = Math.floor(1000 + Math.random() * 9000);
          const requestId = `NP-${datePart}-${randomPart}`;

          const message = [
            '*New Appointment Request*',
            `*Request ID:* ${requestId}`,
            '',
            '*Patient Details*',
            `- Name: ${name}`,
            `- Phone: ${phone}`,
            `- Problem: ${problem}`,
            '',
            'Please confirm available appointment slots.',
            '',
            'Thank you.',
          ].join('\n');

          const url = `https://wa.me/918218652502?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        };

        form.addEventListener('submit', onSubmit);
        cleanup.push(() => {
          form.removeEventListener('submit', onSubmit);
        });
      }
    };

    void initializeInteractions();

    return () => {
      cleanup.forEach((cb) => cb());
      swiperInstance?.destroy(true, true);
    };
  }, []);

  return (
    <>
      <style>{markup.styleText}</style>
      <FloatingWhatsAppButton html={markup.floatingHtml} />
      <ClinicNavbar html={markup.headerHtml} />
      <ClinicMainContent html={markup.mainHtml} />
      <ClinicFooter html={markup.footerHtml} />
    </>
  );
}
