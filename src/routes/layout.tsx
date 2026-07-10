import { component$, Slot, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getExperiences } from "~/lib/firestore-rest";
import type { Experience } from "~/lib/types";

export const useMenuData = routeLoader$(async () => {
  const exps = await getExperiences();
  return { experiences: exps };
});

function formatCategoryLabel(category: string): string {
  if (!category) return "Experiences";
  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

function groupExperiencesByCategory(experiences: Experience[]) {
  const groups = new Map<string, Experience[]>();

  for (const experience of experiences) {
    const key = experience.category?.trim() || "Experiences";
    const existing = groups.get(key) || [];
    existing.push(experience);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    label: formatCategoryLabel(category),
    items,
  }));
}

export default component$(() => {
  const data = useMenuData();
  const menuOpen = useSignal(false);
  const menuGroups = groupExperiencesByCategory(data.value.experiences);

  return (
    <div class="min-h-screen flex flex-col bg-white">
      <header class="w-full bg-nav-bg h-[100px] shrink-0">
        <div class="h-full px-5 flex items-center justify-between max-w-full">
          <a
            href="/"
            class="font-serif font-light text-black text-lg sm:text-2xl tracking-[2px] no-underline"
          >
            EXPERIENCE COLLECTION
          </a>
          <button
            onClick$={() => (menuOpen.value = true)}
            class="text-black bg-transparent border-none cursor-pointer p-2 pr-4"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-[34px] h-[34px]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen.value && (
        <div class="fixed inset-0 z-50 bg-navy/20 backdrop-blur-[2px]">
          <div class="h-full overflow-y-auto bg-[linear-gradient(135deg,#f7f7f3_0%,#ffffff_38%,#edf3f1_100%)]">
            <div class="mx-auto flex min-h-full max-w-[1380px] flex-col px-5 py-5 md:px-8 md:py-7">
              <div class="mb-8 flex items-start justify-between gap-6 border-b border-navy/10 pb-6">
                <div class="max-w-[680px]">
                  <a
                    href="/"
                    onClick$={() => (menuOpen.value = false)}
                    class="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.28em] text-primary no-underline"
                  >
                    <span aria-hidden="true">←</span>
                    Back to home
                  </a>
                  <p class="mt-4 mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-navy/55">
                    Explore the collection
                  </p>
                  <h2 class="m-0 font-serif text-[32px] leading-none text-navy md:text-[54px]">
                    Pick an experience like you would on a real website menu.
                  </h2>
                  <p class="mt-4 mb-0 max-w-[560px] font-sans text-base leading-7 text-navy/75">
                    Browse by collection and jump directly into the adventure you want instead of
                    scanning one long centered list.
                  </p>
                </div>
                <button
                  onClick$={() => (menuOpen.value = false)}
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-navy/15 bg-white/85 text-primary shadow-[0_12px_30px_rgba(48,50,75,0.08)] transition-colors hover:bg-white"
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="h-7 w-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav class="grid gap-5 pb-8 md:grid-cols-2 xl:grid-cols-3">
                {menuGroups.map((group) => (
                  <section
                    key={group.category}
                    class="rounded-[28px] border border-navy/10 bg-white/88 p-5 shadow-[0_18px_45px_rgba(48,50,75,0.06)]"
                  >
                    <p class="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.26em] text-primary/80">
                      {group.label}
                    </p>
                    <div class="flex flex-col gap-1">
                      {group.items.map((exp: Experience) => (
                        <a
                          key={exp.slug}
                          href={`/experience/${exp.slug}`}
                          class="rounded-2xl px-3 py-3 font-serif text-xl leading-7 text-navy no-underline transition-colors hover:bg-primary hover:text-white"
                          onClick$={() => (menuOpen.value = false)}
                        >
                          {exp.title}
                        </a>
                      ))}
                    </div>
                  </section>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <main class="flex-1">
        <Slot />
      </main>
    </div>
  );
});
