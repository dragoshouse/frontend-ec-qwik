import { component$, useSignal, useTask$, useVisibleTask$, $ } from "@builder.io/qwik";
import { routeLoader$, useNavigate, useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { CategoriesModal } from "~/components/categories-modal/categories-modal";
import { ExperienceCard } from "~/components/experience-card/experience-card";
import { FooterLogo } from "~/components/footer-logo/footer-logo";
import {
  getExperiences,
  getHomePageContent,
  getCancellationPolicy,
} from "~/lib/firestore-rest";
import { renderCenteredMarkdown, renderPolicyMarkdown } from "~/lib/markdown";
import type { Experience, HomePageContent, CancellationPolicy } from "~/lib/types";

const CATEGORIES = [
  { value: "", label: "Filter by category" },
  { value: "classic", label: "Classic" },
  { value: "signaturePlus", label: "Signature +" },
  { value: "curated", label: "Curated" },
  { value: "all", label: "See all" },
];

const DEFAULT_HP: HomePageContent = {
  title: "Elevate your outdoor experience",
  subtitle: "Welcome To No Limit Adventures Experience Catalog",
  description:
    "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic costa rican adventure.\n\nAll of our experiences include private roundtrip transportation and a bilingual tour guide.",
  background: "",
};

const DEFAULT_CP: CancellationPolicy = {
  title: "Cancellation Policy",
  description: "",
};

const CARD_WIDTH = 360;
const CARD_SPACING = 10;

function resolveCardWidth(containerWidth: number): number {
  const available = containerWidth > 0 ? containerWidth : 1200;
  let columns = 3;
  while (columns > 1 && CARD_WIDTH * columns + CARD_SPACING * (columns - 1) > available) {
    columns--;
  }
  const widthForCards = available - CARD_SPACING * (columns - 1);
  return Math.min(CARD_WIDTH, widthForCards / columns);
}

function filterExperiences(experiences: Experience[], category: string): Experience[] {
  if (!category || category === "all") return experiences;
  const normalized = category.trim().toLowerCase();
  return experiences.filter(
    (e) => e.category.trim().toLowerCase() === normalized,
  );
}

export const useHomeData = routeLoader$(async () => {
  const [exps, hp, cp] = await Promise.all([
    getExperiences(),
    getHomePageContent().catch(() => null),
    getCancellationPolicy().catch(() => null),
  ]);
  return {
    experiences: exps,
    homePage: hp || DEFAULT_HP,
    cancellationPolicy: cp || DEFAULT_CP,
  };
});

export default component$(() => {
  const data = useHomeData();
  const nav = useNavigate();
  const loc = useLocation();
  const selectedCategory = useSignal(loc.url.searchParams.get("category") || "");
  const categoriesOpen = useSignal(false);
  const gridWidth = useSignal(1200);

  useTask$(({ track }) => {
    track(() => loc.url.searchParams.get("category"));
    selectedCategory.value = loc.url.searchParams.get("category") || "";
  });

  // ResizeObserver requires DOM — runs client-side only
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const grid = document.getElementById("experience-grid-container");
    if (!grid) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        gridWidth.value = entry.contentRect.width;
      }
    });
    observer.observe(grid);
    gridWidth.value = grid.clientWidth;
    return () => observer.disconnect();
  });

  const hp = data.value.homePage;
  const cp = data.value.cancellationPolicy;
  const allExperiences = data.value.experiences;
  const filteredExperiences = filterExperiences(allExperiences, selectedCategory.value);
  const cardWidth = resolveCardWidth(gridWidth.value);

  const heroTitle = hp.title.trim() || DEFAULT_HP.title;
  const heroSubtitle = hp.subtitle.trim() || DEFAULT_HP.subtitle;
  const descriptionText = hp.description.trim() || DEFAULT_HP.description;

  return (
    <div>
      {/* Hero */}
      <section
        class="relative w-full overflow-hidden bg-primary-bg"
        style={{ height: "clamp(420px, 65vh, 560px)" }}
      >
        <img
          src={hp.background || "/images/Background_EC.jpg"}
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Logo — top center on compact, top-right on desktop */}
        <img
          src="/images/Logo_Gordo_(1).png"
          alt="Logo"
          class="absolute top-5 left-1/2 -translate-x-1/2 h-[85px] w-auto md:h-[108px] lg:left-auto lg:translate-x-0 lg:top-4 lg:right-8 lg:h-[132px]"
          width={132}
          height={132}
        />
        {/* Hero text — bottom aligned */}
        <div class="absolute inset-x-0 bottom-0 px-6 md:px-[8%] pb-6 md:pb-0">
          <div class="max-w-[1360px] mx-auto lg:mx-0 lg:max-w-[82vw] text-left md:text-center lg:text-left">
            <p class="font-serif font-medium text-white text-lg md:text-xl tracking-[0.5px] mb-3 m-0">
              {heroSubtitle}
            </p>
            <h1 class="font-sans font-light text-white leading-none tracking-[1px] text-[32px] md:text-[68px] xl:text-[96px] uppercase m-0 max-w-full">
              {heroTitle.toUpperCase()}
            </h1>
          </div>
        </div>
      </section>

      {/* Description — centered markdown */}
      {descriptionText && (
        <section class="bg-white pt-6 pb-7 px-6 md:px-4">
          <div
            class="max-w-[800px] mx-auto"
            dangerouslySetInnerHTML={renderCenteredMarkdown(descriptionText)}
          />
        </section>
      )}

      {/* Explore Categories Button */}
      <section class="flex justify-center pb-6">
        <button
          onClick$={() => (categoriesOpen.value = true)}
          class="bg-btn-bg rounded-full px-6 py-3 font-serif font-semibold text-sm text-navy border-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          EXPLORE OUR EXPERIENCE CATEGORIES
        </button>
      </section>

      {categoriesOpen.value && (
        <CategoriesModal onClose={$(() => { categoriesOpen.value = false; })} />
      )}

      {/* Category Filter */}
      <section class="max-w-[1080px] mx-auto pt-[50px] pb-2.5 px-4">
        <div class="flex justify-end pb-5">
          <select
            value={selectedCategory.value}
            onChange$={(e) => {
              const val = (e.target as HTMLSelectElement).value;
              selectedCategory.value = val;
              if (val && val !== "all") {
                nav(`/?category=${val}`);
              } else {
                nav("/");
              }
            }}
            class="w-[300px] h-[50px] border-2 border-navy bg-white font-sans font-light text-base tracking-[1.5px] text-navy px-3 cursor-pointer appearance-none bg-[length:24px] bg-no-repeat bg-[right_12px_center]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2330324B' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value || "default"} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Experience Grid */}
      <section class="max-w-[1200px] mx-auto px-4 pb-[50px]">
        <div
          id="experience-grid-container"
          class="flex flex-wrap gap-2.5 justify-start"
        >
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.slug} exp={exp} width={cardWidth} />
          ))}
        </div>
      </section>

      {/* Cancellation Policy + Footer */}
      {cp.description && (
        <section class="bg-white">
          <div class="py-12 px-4 text-center">
            <div class="max-w-[900px] mx-auto">
              <h2 class="font-serif font-semibold text-xl text-navy mb-3 m-0">
                {cp.title || "Cancellation Policy"}
              </h2>
              <div
                dangerouslySetInnerHTML={renderPolicyMarkdown(cp.description)}
              />
            </div>
          </div>
          <FooterLogo />
        </section>
      )}

      {!cp.description && <FooterLogo />}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Experience Collection | 360° Travel inspirations",
  meta: [
    {
      name: "description",
      content:
        "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic Costa Rican adventure.",
    },
    { property: "og:title", content: "Experience Collection" },
    {
      property: "og:description",
      content:
        "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic Costa Rican adventure.",
    },
    { property: "og:image", content: "/images/thumbnailNLA_(1)_(1).png" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Experience Collection" },
    {
      name: "twitter:description",
      content:
        "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic Costa Rican adventure.",
    },
    { name: "twitter:image", content: "/images/thumbnailNLA_(1)_(1).png" },
  ],
};
