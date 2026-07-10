import { component$ } from "@builder.io/qwik";
import type { Experience } from "~/lib/types";

function formatCategory(category: string): string {
  if (!category) return category;
  let formatted = category.charAt(0).toUpperCase() + category.slice(1);
  formatted = formatted.replace(/Plus/gi, "+");
  return formatted;
}

interface ExperienceCardProps {
  exp: Experience;
  width: number;
}

export const ExperienceCard = component$<ExperienceCardProps>(({ exp, width }) => {
  const durationBadges = [
    exp.threeQuartersDay && { icon: "/images/Three_quarters_day.png", label: "3/4 day" },
    exp.halfDay && { icon: "/images/Half_day_(1).png", label: "1/2 day" },
    exp.fullDay && { icon: "/images/Full_Day.png", label: "full day" },
  ].filter(Boolean) as { icon: string; label: string }[];

  const difficultyIcon = exp.difficulty
    ? `/images/difficulty_icons/${exp.difficulty.toLowerCase()}.svg`
    : null;

  return (
    <a
      href={`/experience/${exp.slug}`}
      style={{ width: `${width}px`, maxWidth: `${width}px` }}
      class="block border border-navy no-underline text-navy shrink-0"
    >
      <img
        src={exp.featuredImage}
        alt={exp.title}
        class="w-full h-[260px] object-cover block"
        width={360}
        height={260}
        loading="lazy"
      />
      <div class="px-4 pt-[15px] pb-2.5">
        <h3 class="font-serif font-semibold text-xl text-navy m-0">
          {exp.title}
        </h3>
        <p class="font-sans font-light text-[17px] text-navy mt-1 mb-1 line-clamp-3 m-0">
          {exp.shortDescription}
        </p>
        <p class="font-sans text-base text-navy mt-1 mb-1 m-0">
          <span class="font-bold">Location:</span>{" "}
          <span class="font-light">{exp.location}</span>
        </p>
        {(durationBadges.length > 0 || difficultyIcon || exp.category) && (
          <div class="flex items-center justify-between w-full mt-1">
            <div class="flex-1 flex flex-wrap items-center gap-3 min-w-0">
              {durationBadges.map((badge) => (
                <span key={badge.label} class="flex items-center gap-1.5 whitespace-nowrap">
                  <img src={badge.icon} alt="" class="w-6 h-6 object-cover rounded-lg" width={24} height={24} />
                  <span class="font-sans text-[13px] font-semibold">{badge.label}</span>
                </span>
              ))}
            </div>
            {difficultyIcon && (
              <div class="flex-1 flex items-center justify-center gap-1.5 min-w-0">
                <img src={difficultyIcon} alt={exp.difficulty} class="w-6 h-6" width={24} height={24} />
                <span class="font-sans text-[13px] font-semibold truncate">{exp.difficulty}</span>
              </div>
            )}
            {exp.category && (
              <div class="flex-1 flex items-center justify-end gap-1.5 min-w-0">
                <img src="/images/flora&fauna.svg" alt="" class="w-6 h-6 shrink-0" width={24} height={24} />
                <span class="font-sans text-[13px] font-semibold truncate">
                  {formatCategory(exp.category)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
});
