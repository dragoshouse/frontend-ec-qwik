import {
  component$,
  useSignal,
  $,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getExperienceBySlug } from "~/lib/firestore-rest";
import { renderMarkdown, convertWhatsAppMarkdown } from "~/lib/markdown";
import { FooterLogo } from "~/components/footer-logo/footer-logo";
import { GalleryLightbox } from "~/components/gallery-lightbox/gallery-lightbox";
export const useExperienceData = routeLoader$(async (requestEvent) => {
  const slug = requestEvent.params.slug;
  const exp = await getExperienceBySlug(slug);
  return { experience: exp };
});

function getSafeVideoEmbedUrl(videoLink: string): string {
  if (!videoLink) return "";

  try {
    const url = new URL(videoLink);
    const shouldMute =
      url.searchParams.get("autoplay") === "1" ||
      /youtube|youtu\.be|vimeo/i.test(url.hostname);

    if (shouldMute) {
      url.searchParams.set("mute", "1");
      url.searchParams.set("muted", "1");
    }

    return url.toString();
  } catch {
    return videoLink;
  }
}

export default component$(() => {
  const data = useExperienceData();
  const exp = data.value.experience;
  const galleryOpen = useSignal(false);
  const galleryIndex = useSignal(0);

  if (!exp) {
    return (
      <div class="flex items-center justify-center min-h-[50vh]">
        <p class="text-navy text-lg">Experience not found.</p>
      </div>
    );
  }

  const images = [
    exp.featuredImage,
    exp.photo1,
    exp.photo2,
    exp.photo3,
    exp.photo4,
  ].filter(Boolean);

  const tags = [
    { key: "thrilling", label: "thrilling", icon: "/images/webExperinceCollectionfinal-10.svg" },
    { key: "hike", label: "hike", icon: "/images/webExperinceCollectionfinal-11.svg" },
    { key: "floraAndFauna", label: "flora&fauna", icon: "/images/flora&fauna.svg" },
    { key: "relax", label: "relax", icon: "/images/webExperinceCollectionfinal-13.svg" },
    { key: "water", label: "water", icon: "/images/webExperinceCollectionfinal-14.svg" },
    { key: "cultural", label: "cultural", icon: "/images/webExperinceCollectionfinal-15.svg" },
    { key: "gourmet", label: "gourmet", icon: "/images/webExperinceCollectionfinal-16.svg" },
  ].filter((tag) => (exp as any)[tag.key]);

  const openGallery = $((index: number) => {
    galleryIndex.value = index;
    galleryOpen.value = true;
  });

  const videoEmbedUrl = getSafeVideoEmbedUrl(exp.videoLink);

  return (
    <div>
      {/* Hero Banner */}
      <section class="relative w-full min-h-[500px] overflow-hidden">
        <img
          src={exp.featuredImage}
          alt={exp.title}
          class="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50" />
        <div class="relative z-10 flex flex-col items-center justify-end min-h-[500px] pb-24 px-6 text-center">
          <img
            src="/images/Logo_Gordo_(1).png"
            alt="Logo"
            class="w-[100px] h-auto mb-4"
            width={100}
            height={100}
          />
          <h1 class="font-serif font-semibold text-white text-3xl md:text-5xl lg:text-6xl mb-2">
            {exp.title}
          </h1>
          <p class="font-sans font-light text-white text-xl md:text-3xl">
            {exp.shortDescription}
          </p>
        </div>
      </section>

      {/* Pricing Bar */}
      <section class="bg-navy py-5">
        <div class="flex flex-wrap items-center justify-center gap-4 px-4">
          <div class="flex items-center gap-2 text-white">
            <img src="/images/pin.png" alt="" class="h-[55px] w-auto" width={55} height={55} />
            <span class="text-lg">{exp.location}</span>
          </div>

          <div class="hidden md:block w-px h-[50px] bg-white/30" />

          <div class="flex items-center gap-3">
            {exp.halfDay && (
              <img src="/images/dayicon-05.png" alt="Half day" class="h-[70px] w-auto" width={70} height={70} />
            )}
            {exp.threeQuartersDay && (
              <img src="/images/dayicon-06.png" alt="3/4 day" class="h-[70px] w-auto" width={70} height={70} />
            )}
            {exp.fullDay && (
              <img src="/images/dayicon-07.png" alt="Full day" class="h-[70px] w-auto" width={70} height={70} />
            )}
          </div>

          <div class="hidden md:block w-px h-[50px] bg-white/30" />

          {exp.groups && exp.groupPrice ? (
            <div class="flex items-center gap-2 text-white">
              <img
                src="https://ec-dragoscloud.b-cdn.net/groupicon.png"
                alt=""
                class="h-9 w-auto brightness-0 invert"
                width={36}
                height={36}
              />
              <span class="text-lg">${exp.groupPrice}</span>
            </div>
          ) : (
            <div class="flex items-center gap-4 text-white">
              <div class="flex items-center gap-2">
                <img src="/images/webExperinceCollectionfinal-06.png" alt="" class="h-[55px] w-auto" width={55} height={55} />
                <span class="text-lg">${exp.price1to2}</span>
              </div>
              <div class="hidden md:block w-px h-[50px] bg-white/30" />
              <div class="flex items-center gap-2">
                <img src="/images/webExperinceCollectionfinal-07.png" alt="" class="h-[55px] w-auto" width={55} height={55} />
                <span class="text-lg">${exp.price3to6}</span>
              </div>
              <div class="hidden md:block w-px h-[50px] bg-white/30" />
              <div class="flex items-center gap-2">
                <img src="/images/webExperinceCollectionfinal-08.png" alt="" class="h-[55px] w-auto" width={55} height={55} />
                <span class="text-lg">${exp.price7}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tags Bar */}
      {tags.length > 0 && (
        <section class="bg-white py-12">
          <div class="max-w-[1200px] mx-auto flex flex-wrap justify-center gap-2.5 px-4">
            {tags.map((tag) => (
              <div key={tag.key} class="flex items-center gap-2">
                <img src={tag.icon} alt={tag.label} class="h-[45px] w-auto" width={55} height={55} />
                <span class="text-lg text-navy">{tag.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Overview */}
      {exp.overview && (
        <section class="max-w-[1200px] mx-auto px-5 pb-12">
          <div class="w-full h-px bg-gold mb-4" />
          <div class="flex items-center gap-3 mb-5">
            <h2 class="font-sans font-bold text-gold text-[28px]">OVERVIEW</h2>
            <button
              onClick$={() => navigator.clipboard.writeText(exp.overview)}
              class="text-gold bg-transparent border-none cursor-pointer p-1"
              aria-label="Copy overview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
          <div
            class="font-sans text-xl text-navy leading-relaxed max-w-none"
            dangerouslySetInnerHTML={renderMarkdown(exp.overview)}
          />
        </section>
      )}

      {/* Activities */}
      {exp.activities.length > 0 && (
        <section class="max-w-[1200px] mx-auto px-5 pb-12">
          <div class="w-full h-px bg-gold mb-4" />
          <div class="flex items-center gap-3 mb-5">
            <h2 class="font-sans font-bold text-gold text-[28px]">ACTIVITIES</h2>
            <button
              onClick$={() => navigator.clipboard.writeText(exp.activities.join("\n"))}
              class="text-gold bg-transparent border-none cursor-pointer p-1"
              aria-label="Copy activities"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
          <div class="font-sans text-xl text-navy leading-relaxed">
            {exp.activities.map((a, i) => (
              <div key={i} class="mb-1">
                {convertWhatsAppMarkdown(a)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Includes */}
      {exp.includes.length > 0 && (
        <section class="max-w-[1200px] mx-auto px-5 pb-12">
          <div class="w-full h-px bg-gold mb-4" />
          <div class="flex items-center gap-3 mb-5">
            <h2 class="font-sans font-bold text-gold text-[28px]">INCLUDES</h2>
            <button
              onClick$={() => navigator.clipboard.writeText(exp.includes.join("\n"))}
              class="text-gold bg-transparent border-none cursor-pointer p-1"
              aria-label="Copy includes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
          <div class="font-sans text-xl text-navy leading-relaxed">
            {exp.includes.map((item, i) => (
              <div key={i} class="mb-1">
                {convertWhatsAppMarkdown(item)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What to Bring */}
      {exp.whatToBring.length > 0 && (
        <section class="max-w-[1200px] mx-auto px-5 pb-12">
          <div class="w-full h-px bg-gold mb-4" />
          <div class="flex items-center gap-3 mb-5">
            <h2 class="font-sans font-bold text-gold text-[28px]">WHAT TO BRING?</h2>
            <button
              onClick$={() => navigator.clipboard.writeText(exp.whatToBring.join("\n"))}
              class="text-gold bg-transparent border-none cursor-pointer p-1"
              aria-label="Copy what to bring"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
          <div class="font-sans text-xl text-navy leading-relaxed hidden md:block">
            <div class="grid grid-cols-3 gap-2.5">
              {exp.whatToBring.map((item, i) => (
                <div key={i} class="p-3 border border-gray-200">
                  {convertWhatsAppMarkdown(item)}
                </div>
              ))}
            </div>
          </div>
          <div class="font-sans text-xl text-navy leading-relaxed md:hidden">
            {exp.whatToBring.map((item, i) => (
              <div key={i} class="mb-1">
                {convertWhatsAppMarkdown(item)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {images.length > 0 && (
        <section class="max-w-[1200px] mx-auto px-5 pb-12">
          <div class="w-full h-px bg-gold mb-4" />
          <h2 class="font-sans font-bold text-gold text-[28px] mb-5">PHOTO GALLERY</h2>
          <div class="flex flex-wrap justify-center gap-2.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick$={() => openGallery(i)}
                class="group overflow-hidden rounded-[22px] border-none p-0 cursor-pointer bg-transparent shadow-[0_18px_45px_rgba(48,50,75,0.12)]"
              >
                <img
                  src={img}
                  alt={`Photo ${i + 1}`}
                  class="w-[220px] h-[150px] object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  width={220}
                  height={150}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Video */}
      {videoEmbedUrl && (
        <section class="max-w-[1200px] mx-auto px-5 pb-12">
          <div class="w-full h-px bg-gold mb-4" />
          <h2 class="font-sans font-bold text-gold text-[28px] mb-5">VIDEO</h2>
          <div class="w-[80%] mx-auto aspect-video">
            <iframe
              src={videoEmbedUrl}
              class="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullscreen
              title="Experience video"
            />
          </div>
        </section>
      )}

      {/* Gallery Modal */}
      <GalleryLightbox
        images={images}
        title={exp.title}
        isOpen={galleryOpen}
        currentIndex={galleryIndex}
      />

      <FooterLogo />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Experience | Experience Collection",
  meta: [
    { name: "description", content: "Experience details" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
};
