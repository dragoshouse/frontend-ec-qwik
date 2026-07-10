import { r as routeLoaderQrl, d as componentQrl, i as inlinedQrl, m as useSignal, h as _jsxQ, n as _noopQrl, o as _wrapSignal, f as _jsxC, S as Slot, k as _fnSignal, p as _jsxBranch, q as useNavigate, e as useLocation, t as useTaskQrl, w as useVisibleTaskQrl, x as useLexicalScope } from "./q-kuzxatUJ.js";
const PROJECT_ID = "catallog-experiences";
const API_KEY = "AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI";
function parseFirestoreValue(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== void 0) result[key] = val.stringValue;
    else if (val.integerValue !== void 0) result[key] = Number(val.integerValue);
    else if (val.doubleValue !== void 0) result[key] = val.doubleValue;
    else if (val.booleanValue !== void 0) result[key] = val.booleanValue;
    else if (val.timestampValue !== void 0) result[key] = val.timestampValue;
    else if (val.arrayValue !== void 0) result[key] = (val.arrayValue.values || []).map((v) => parseFirestoreValue({
      _: v
    })._);
    else if (val.nullValue !== void 0) result[key] = null;
    else result[key] = null;
  }
  return result;
}
function decodeFlexibleBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") return val.toLowerCase() === "true";
  return false;
}
const serverCache = /* @__PURE__ */ new Map();
const CACHE_TTL = 6e4;
function getCached(key) {
  const entry = serverCache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data;
  serverCache.delete(key);
  return null;
}
function setCache(key, data) {
  serverCache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL
  });
}
async function fetchCollection(collection) {
  const cached = getCached(collection);
  if (cached) return cached;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.documents) return [];
  const results = data.documents.map((doc) => {
    const parsed = parseFirestoreValue(doc.fields);
    return parsed;
  });
  setCache(collection, results);
  return results;
}
async function fetchSingleDocument(collection) {
  const docs = await fetchCollection(collection);
  return docs.length > 0 ? docs[0] : null;
}
function parseCreatedAt(value) {
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}
async function getExperiences() {
  const docs = await fetchCollection("experiences");
  const mapped = docs.map((doc) => ({
    title: doc.title || "",
    shortDescription: doc.shortDescription || "",
    location: doc.location || "",
    slug: doc.slug || "",
    category: doc.category || doc.Category || "",
    overview: doc.overview || "",
    activities: doc.activities || [],
    includes: doc.includes || [],
    whatToBring: doc.whatToBring || [],
    featuredImage: doc.featuredImage || "",
    photo1: doc.photo1 || "",
    photo2: doc.photo2 || "",
    photo3: doc.photo3 || "",
    photo4: doc.photo4 || "",
    price1to2: doc.price1to2 || "",
    price3to6: doc.price3to6 || "",
    price7: doc.price7 || "",
    groupPrice: doc.groupPrice || "",
    groups: decodeFlexibleBool(doc.groups || doc.GROUPS),
    halfDay: decodeFlexibleBool(doc.halfDay),
    threeQuartersDay: decodeFlexibleBool(doc.threeQuartersDay),
    fullDay: decodeFlexibleBool(doc.fullDay),
    thrilling: decodeFlexibleBool(doc.thrilling),
    hike: decodeFlexibleBool(doc.hike),
    floraAndFauna: decodeFlexibleBool(doc.floraAndFauna),
    relax: decodeFlexibleBool(doc.relax),
    water: decodeFlexibleBool(doc.water),
    cultural: decodeFlexibleBool(doc.cultural),
    gourmet: decodeFlexibleBool(doc.gourmet),
    status: decodeFlexibleBool(doc.status),
    videoLink: doc.videoLink || "",
    difficulty: doc.difficulty || "",
    createdAt: doc.createdAt || ""
  })).filter((e) => e.status);
  return mapped.sort((a, b) => parseCreatedAt(b.createdAt) - parseCreatedAt(a.createdAt));
}
async function getExperienceBySlug(slug) {
  const experiences = await getExperiences();
  return experiences.find((e) => e.slug === slug) || null;
}
async function getHomePageContent() {
  return fetchSingleDocument("home_page");
}
async function getCancellationPolicy() {
  return fetchSingleDocument("cancellation_policy");
}
const s_3YSozE4f0Wk = async () => {
  const exps = await getExperiences();
  return {
    experiences: exps
  };
};
const useMenuData = routeLoaderQrl(/* @__PURE__ */ inlinedQrl(s_3YSozE4f0Wk, "s_3YSozE4f0Wk"));
function formatCategoryLabel(category) {
  if (!category) return "Experiences";
  return category.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
}
function groupExperiencesByCategory(experiences) {
  var _a;
  const groups = /* @__PURE__ */ new Map();
  for (const experience of experiences) {
    const key = ((_a = experience.category) == null ? void 0 : _a.trim()) || "Experiences";
    const existing = groups.get(key) || [];
    existing.push(experience);
    groups.set(key, existing);
  }
  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    label: formatCategoryLabel(category),
    items
  }));
}
const s_VKFlAWJuVm8 = () => {
  const data = useMenuData();
  const menuOpen = useSignal(false);
  const menuGroups = groupExperiencesByCategory(data.value.experiences);
  return /* @__PURE__ */ _jsxQ("div", null, {
    class: "min-h-screen flex flex-col bg-white"
  }, [
    /* @__PURE__ */ _jsxQ("header", null, {
      class: "w-full bg-nav-bg h-[100px] shrink-0"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "h-full px-5 flex items-center justify-between max-w-full"
    }, [
      /* @__PURE__ */ _jsxQ("a", null, {
        href: "/",
        class: "font-serif font-light text-black text-lg sm:text-2xl tracking-[2px] no-underline"
      }, "EXPERIENCE COLLECTION", 3, null),
      /* @__PURE__ */ _jsxQ("button", null, {
        class: "text-black bg-transparent border-none cursor-pointer p-2 pr-4",
        "aria-label": "Menu",
        onClick$: /* @__PURE__ */ _noopQrl("s_2avbaoksMtI", [
          menuOpen
        ])
      }, /* @__PURE__ */ _jsxQ("svg", null, {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": 1.5,
        stroke: "currentColor",
        class: "w-[34px] h-[34px]"
      }, /* @__PURE__ */ _jsxQ("path", null, {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      }, null, 3, null), 3, null), 3, null)
    ], 3, null), 3, null),
    menuOpen.value && /* @__PURE__ */ _jsxQ("div", null, {
      class: "fixed inset-0 z-50 bg-navy/20 backdrop-blur-[2px]"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "h-full overflow-y-auto bg-[linear-gradient(135deg,#f7f7f3_0%,#ffffff_38%,#edf3f1_100%)]"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "mx-auto flex min-h-full max-w-[1380px] flex-col px-5 py-5 md:px-8 md:py-7"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "mb-8 flex items-start justify-between gap-6 border-b border-navy/10 pb-6"
      }, [
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "max-w-[680px]"
        }, [
          /* @__PURE__ */ _jsxQ("a", null, {
            href: "/",
            class: "inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.28em] text-primary no-underline",
            onClick$: /* @__PURE__ */ _noopQrl("s_jMe52qsCbr0", [
              menuOpen
            ])
          }, [
            /* @__PURE__ */ _jsxQ("span", null, {
              "aria-hidden": "true"
            }, "←", 3, null),
            "Back to home"
          ], 3, null),
          /* @__PURE__ */ _jsxQ("p", null, {
            class: "mt-4 mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-navy/55"
          }, "Explore the collection", 3, null),
          /* @__PURE__ */ _jsxQ("h2", null, {
            class: "m-0 font-serif text-[32px] leading-none text-navy md:text-[54px]"
          }, "Pick an experience like you would on a real website menu.", 3, null),
          /* @__PURE__ */ _jsxQ("p", null, {
            class: "mt-4 mb-0 max-w-[560px] font-sans text-base leading-7 text-navy/75"
          }, "Browse by collection and jump directly into the adventure you want instead of scanning one long centered list.", 3, null)
        ], 3, null),
        /* @__PURE__ */ _jsxQ("button", null, {
          class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-navy/15 bg-white/85 text-primary shadow-[0_12px_30px_rgba(48,50,75,0.08)] transition-colors hover:bg-white",
          "aria-label": "Close menu",
          onClick$: /* @__PURE__ */ _noopQrl("s_PU1RdGVTkDA", [
            menuOpen
          ])
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "h-7 w-7"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M6 18L18 6M6 6l12 12"
        }, null, 3, null), 3, null), 3, null)
      ], 3, null),
      /* @__PURE__ */ _jsxQ("nav", null, {
        class: "grid gap-5 pb-8 md:grid-cols-2 xl:grid-cols-3"
      }, menuGroups.map((group) => /* @__PURE__ */ _jsxQ("section", null, {
        class: "rounded-[28px] border border-navy/10 bg-white/88 p-5 shadow-[0_18px_45px_rgba(48,50,75,0.06)]"
      }, [
        /* @__PURE__ */ _jsxQ("p", null, {
          class: "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.26em] text-primary/80"
        }, _wrapSignal(group, "label"), 1, null),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex flex-col gap-1"
        }, group.items.map((exp) => /* @__PURE__ */ _jsxQ("a", {
          href: `/experience/${exp.slug}`
        }, {
          class: "rounded-2xl px-3 py-3 font-serif text-xl leading-7 text-navy no-underline transition-colors hover:bg-primary hover:text-white",
          onClick$: /* @__PURE__ */ _noopQrl("s_KGHaPNV0dOc", [
            menuOpen
          ])
        }, _wrapSignal(exp, "title"), 1, exp.slug)), 1, null)
      ], 1, group.category)), 1, null)
    ], 1, null), 1, null), 1, "yB_0"),
    /* @__PURE__ */ _jsxQ("main", null, {
      class: "flex-1"
    }, /* @__PURE__ */ _jsxC(Slot, null, 3, "yB_1"), 1, null)
  ], 1, "yB_2");
};
const layout = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl(s_VKFlAWJuVm8, "s_VKFlAWJuVm8"));
const Layout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _auto_groupExperiencesByCategory: groupExperiencesByCategory,
  default: layout,
  useMenuData
}, Symbol.toStringTag, { value: "Module" }));
const s_hb2gOhhVlHU = (props) => {
  return /* @__PURE__ */ _jsxQ("div", null, {
    class: "fixed inset-0 z-[60] bg-btn-bg flex flex-col"
  }, [
    /* @__PURE__ */ _jsxQ("button", {
      onClick$: props.onClose
    }, {
      class: "absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/50 border-none cursor-pointer flex items-center justify-center",
      "aria-label": "Close categories"
    }, /* @__PURE__ */ _jsxQ("svg", null, {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      "stroke-width": 1.5,
      stroke: "currentColor",
      class: "w-7 h-7 text-black"
    }, /* @__PURE__ */ _jsxQ("path", null, {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18L18 6M6 6l12 12"
    }, null, 3, null), 3, null), 2, null),
    /* @__PURE__ */ _jsxQ("div", null, {
      class: "flex-1 flex items-center justify-center p-4 overflow-auto"
    }, /* @__PURE__ */ _jsxQ("img", null, {
      src: "https://ec-dragoscloud.b-cdn.net/ExperienceCategories.png",
      alt: "Experience Categories",
      class: "max-w-full max-h-full object-contain",
      width: 1200,
      height: 800
    }, null, 3, null), 3, null)
  ], 1, "UO_0");
};
const CategoriesModal = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl(s_hb2gOhhVlHU, "s_hb2gOhhVlHU"));
function formatCategory(category) {
  if (!category) return category;
  let formatted = category.charAt(0).toUpperCase() + category.slice(1);
  formatted = formatted.replace(/Plus/gi, "+");
  return formatted;
}
const s_2MxzONhr2Go = (props) => {
  const durationBadges = [
    props.exp.threeQuartersDay && {
      icon: "/images/Three_quarters_day.png",
      label: "3/4 day"
    },
    props.exp.halfDay && {
      icon: "/images/Half_day_(1).png",
      label: "1/2 day"
    },
    props.exp.fullDay && {
      icon: "/images/Full_Day.png",
      label: "full day"
    }
  ].filter(Boolean);
  const difficultyIcon = props.exp.difficulty ? `/images/difficulty_icons/${props.exp.difficulty.toLowerCase()}.svg` : null;
  return /* @__PURE__ */ _jsxQ("a", null, {
    href: _fnSignal((p0) => `/experience/${p0.exp.slug}`, [
      props
    ], "`/experience/${p0.exp.slug}`"),
    style: _fnSignal((p0) => ({
      width: `${p0.width}px`,
      maxWidth: `${p0.width}px`
    }), [
      props
    ], "{width:`${p0.width}px`,maxWidth:`${p0.width}px`}"),
    class: "block border border-navy no-underline text-navy shrink-0"
  }, [
    /* @__PURE__ */ _jsxQ("img", null, {
      src: _fnSignal((p0) => p0.exp.featuredImage, [
        props
      ], "p0.exp.featuredImage"),
      alt: _fnSignal((p0) => p0.exp.title, [
        props
      ], "p0.exp.title"),
      class: "w-full h-[260px] object-cover block",
      width: 360,
      height: 260,
      loading: "lazy"
    }, null, 3, null),
    /* @__PURE__ */ _jsxQ("div", null, {
      class: "px-4 pt-[15px] pb-2.5"
    }, [
      /* @__PURE__ */ _jsxQ("h3", null, {
        class: "font-serif font-semibold text-xl text-navy m-0"
      }, _fnSignal((p0) => p0.exp.title, [
        props
      ], "p0.exp.title"), 3, null),
      /* @__PURE__ */ _jsxQ("p", null, {
        class: "font-sans font-light text-[17px] text-navy mt-1 mb-1 line-clamp-3 m-0"
      }, _fnSignal((p0) => p0.exp.shortDescription, [
        props
      ], "p0.exp.shortDescription"), 3, null),
      /* @__PURE__ */ _jsxQ("p", null, {
        class: "font-sans text-base text-navy mt-1 mb-1 m-0"
      }, [
        /* @__PURE__ */ _jsxQ("span", null, {
          class: "font-bold"
        }, "Location:", 3, null),
        " ",
        /* @__PURE__ */ _jsxQ("span", null, {
          class: "font-light"
        }, _fnSignal((p0) => p0.exp.location, [
          props
        ], "p0.exp.location"), 3, null)
      ], 3, null),
      (durationBadges.length > 0 || difficultyIcon || props.exp.category) && /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center justify-between w-full mt-1"
      }, [
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex-1 flex flex-wrap items-center gap-3 min-w-0"
        }, durationBadges.map((badge) => /* @__PURE__ */ _jsxQ("span", null, {
          class: "flex items-center gap-1.5 whitespace-nowrap"
        }, [
          /* @__PURE__ */ _jsxQ("img", {
            src: _wrapSignal(badge, "icon")
          }, {
            alt: "",
            class: "w-6 h-6 object-cover rounded-lg",
            width: 24,
            height: 24
          }, null, 3, null),
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "font-sans text-[13px] font-semibold"
          }, _wrapSignal(badge, "label"), 1, null)
        ], 1, badge.label)), 1, null),
        difficultyIcon && /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex-1 flex items-center justify-center gap-1.5 min-w-0"
        }, [
          /* @__PURE__ */ _jsxQ("img", {
            src: difficultyIcon
          }, {
            alt: _fnSignal((p0) => p0.exp.difficulty, [
              props
            ], "p0.exp.difficulty"),
            class: "w-6 h-6",
            width: 24,
            height: 24
          }, null, 3, null),
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "font-sans text-[13px] font-semibold truncate"
          }, _fnSignal((p0) => p0.exp.difficulty, [
            props
          ], "p0.exp.difficulty"), 3, null)
        ], 1, "30_0"),
        props.exp.category && /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex-1 flex items-center justify-end gap-1.5 min-w-0"
        }, [
          /* @__PURE__ */ _jsxQ("img", null, {
            src: "/images/flora&fauna.svg",
            alt: "",
            class: "w-6 h-6 shrink-0",
            width: 24,
            height: 24
          }, null, 3, null),
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "font-sans text-[13px] font-semibold truncate"
          }, formatCategory(props.exp.category), 1, null)
        ], 1, "30_1")
      ], 1, "30_2")
    ], 1, null)
  ], 1, "30_3");
};
const ExperienceCard = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl(s_2MxzONhr2Go, "s_2MxzONhr2Go"));
const s_h8vVr0bw3vI = () => {
  return /* @__PURE__ */ _jsxQ("div", null, {
    class: "w-full h-[170px] bg-nav-bg flex items-center justify-center shrink-0"
  }, /* @__PURE__ */ _jsxQ("a", null, {
    href: "https://nolimitadventurescr.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /* @__PURE__ */ _jsxQ("img", null, {
    src: "/images/Logo_Gordo_(1).png",
    alt: "No Limit Adventures",
    class: "h-20 w-auto",
    width: 80,
    height: 80
  }, null, 3, null), 3, null), 3, "YA_0");
};
const FooterLogo = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl(s_h8vVr0bw3vI, "s_h8vVr0bw3vI"));
function convertWhatsAppMarkdown(text) {
  if (!text) return "";
  let cleaned = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\\n/g, "\n");
  const boldPattern = /(^|[^\S\r\n\[\(\{>])\*(?!\s)([^*\n]+?)\*(?=[^\w*]|$)/g;
  cleaned = cleaned.replace(boldPattern, (_, leading, content) => `${leading}**${content}**`);
  const strikePattern = /(^|[^\S\r\n\[\(\{>])~(?!\s)([^~\n]+?)~(?=[^\w~]|$)/g;
  cleaned = cleaned.replace(strikePattern, (_, leading, content) => `${leading}~~${content}~~`);
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}
function cleanupMarkdown(input) {
  let normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\\n/g, "\n");
  normalized = normalized.replace(/\n{3,}/g, "\n\n");
  const lines = normalized.split("\n").map((line) => line.trimEnd());
  const buffer = [];
  let previousHadText = false;
  for (const line of lines) {
    const hasText = line.trim().length > 0;
    if (hasText && previousHadText) buffer.push("");
    else if (!hasText && previousHadText) buffer.push("");
    else if (!hasText) {
      previousHadText = false;
      continue;
    }
    buffer.push(line.trimEnd());
    previousHadText = hasText;
  }
  return buffer.join("\n").trim();
}
function renderParagraphs(text, paragraphClass, strongClass) {
  const converted = convertWhatsAppMarkdown(cleanupMarkdown(text));
  if (!converted) return "";
  return converted.split("\n\n").filter((p) => p.trim()).map((p) => {
    const withBold = p.replace(/\*\*([^*]+)\*\*/g, `<strong class="${strongClass}">$1</strong>`);
    const withStrike = withBold.replace(/~~([^~]+)~~/g, '<del class="line-through opacity-60">$1</del>');
    return `<p class="${paragraphClass}">${withStrike.replace(/\n/g, "<br/>")}</p>`;
  }).join("");
}
function renderCenteredMarkdown(text) {
  return renderParagraphs(text, "mb-4 last:mb-0 text-sm md:text-xl text-navy tracking-[0.2px] leading-[1.5] font-normal text-center", "font-bold");
}
function renderPolicyMarkdown(text) {
  return renderParagraphs(text, "mb-4 last:mb-0 text-sm md:text-base text-navy tracking-[0.2px] leading-[1.5] font-normal text-center", "font-bold");
}
function renderMarkdown(text) {
  return renderParagraphs(text, "mb-3 leading-relaxed", "font-semibold");
}
const CATEGORIES = [
  {
    value: "",
    label: "Filter by category"
  },
  {
    value: "classic",
    label: "Classic"
  },
  {
    value: "signaturePlus",
    label: "Signature +"
  },
  {
    value: "curated",
    label: "Curated"
  },
  {
    value: "all",
    label: "See all"
  }
];
const DEFAULT_HP = {
  title: "Elevate your outdoor experience",
  subtitle: "Welcome To No Limit Adventures Experience Catalog",
  description: "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic costa rican adventure.\n\nAll of our experiences include private roundtrip transportation and a bilingual tour guide.",
  background: ""
};
const DEFAULT_CP = {
  title: "Cancellation Policy",
  description: ""
};
const CARD_WIDTH = 360;
const CARD_SPACING = 10;
function resolveCardWidth(containerWidth) {
  const available = containerWidth > 0 ? containerWidth : 1200;
  let columns = 3;
  while (columns > 1 && CARD_WIDTH * columns + CARD_SPACING * (columns - 1) > available) columns--;
  const widthForCards = available - CARD_SPACING * (columns - 1);
  return Math.min(CARD_WIDTH, widthForCards / columns);
}
function filterExperiences(experiences, category) {
  if (!category || category === "all") return experiences;
  const normalized = category.trim().toLowerCase();
  return experiences.filter((e) => e.category.trim().toLowerCase() === normalized);
}
const s_6WFkDDuCKa0 = async () => {
  const [exps, hp, cp] = await Promise.all([
    getExperiences(),
    getHomePageContent().catch(() => null),
    getCancellationPolicy().catch(() => null)
  ]);
  return {
    experiences: exps,
    homePage: hp || DEFAULT_HP,
    cancellationPolicy: cp || DEFAULT_CP
  };
};
const useHomeData = routeLoaderQrl(/* @__PURE__ */ inlinedQrl(s_6WFkDDuCKa0, "s_6WFkDDuCKa0"));
const s_yxtomTAcFP0 = ({ track }) => {
  const [loc, selectedCategory] = useLexicalScope();
  track(() => loc.url.searchParams.get("category"));
  selectedCategory.value = loc.url.searchParams.get("category") || "";
};
const s_5s110co2AxQ = () => {
  const [categoriesOpen] = useLexicalScope();
  categoriesOpen.value = false;
};
const s_B0lqk5IDDy4 = () => {
  _jsxBranch();
  const data = useHomeData();
  const nav = useNavigate();
  const loc = useLocation();
  const selectedCategory = useSignal(loc.url.searchParams.get("category") || "");
  const categoriesOpen = useSignal(false);
  const gridWidth = useSignal(1200);
  useTaskQrl(/* @__PURE__ */ inlinedQrl(s_yxtomTAcFP0, "s_yxtomTAcFP0", [
    loc,
    selectedCategory
  ]));
  useVisibleTaskQrl(/* @__PURE__ */ _noopQrl("s_hs55Cc65pvA", [
    gridWidth
  ]));
  const hp = data.value.homePage;
  const cp = data.value.cancellationPolicy;
  const allExperiences = data.value.experiences;
  const filteredExperiences = filterExperiences(allExperiences, selectedCategory.value);
  const cardWidth = resolveCardWidth(gridWidth.value);
  const heroTitle = hp.title.trim() || DEFAULT_HP.title;
  const heroSubtitle = hp.subtitle.trim() || DEFAULT_HP.subtitle;
  const descriptionText = hp.description.trim() || DEFAULT_HP.description;
  return /* @__PURE__ */ _jsxQ("div", null, null, [
    /* @__PURE__ */ _jsxQ("section", null, {
      class: "relative w-full overflow-hidden bg-primary-bg",
      style: {
        height: "clamp(420px, 65vh, 560px)"
      }
    }, [
      /* @__PURE__ */ _jsxQ("img", {
        src: hp.background || "/images/Background_EC.jpg"
      }, {
        alt: "",
        class: "absolute inset-0 w-full h-full object-cover",
        width: 1920,
        height: 1080
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("img", null, {
        src: "/images/Logo_Gordo_(1).png",
        alt: "Logo",
        class: "absolute top-5 left-1/2 -translate-x-1/2 h-[85px] w-auto md:h-[108px] lg:left-auto lg:translate-x-0 lg:top-4 lg:right-8 lg:h-[132px]",
        width: 132,
        height: 132
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "absolute inset-x-0 bottom-0 px-6 md:px-[8%] pb-6 md:pb-0"
      }, /* @__PURE__ */ _jsxQ("div", null, {
        class: "max-w-[1360px] mx-auto lg:mx-0 lg:max-w-[82vw] text-left md:text-center lg:text-left"
      }, [
        /* @__PURE__ */ _jsxQ("p", null, {
          class: "font-serif font-medium text-white text-lg md:text-xl tracking-[0.5px] mb-3 m-0"
        }, heroSubtitle, 1, null),
        /* @__PURE__ */ _jsxQ("h1", null, {
          class: "font-sans font-light text-white leading-none tracking-[1px] text-[32px] md:text-[68px] xl:text-[96px] uppercase m-0 max-w-full"
        }, heroTitle.toUpperCase(), 1, null)
      ], 1, null), 1, null)
    ], 1, null),
    descriptionText && /* @__PURE__ */ _jsxQ("section", null, {
      class: "bg-white pt-6 pb-7 px-6 md:px-4"
    }, /* @__PURE__ */ _jsxQ("div", {
      dangerouslySetInnerHTML: renderCenteredMarkdown(descriptionText)
    }, {
      class: "max-w-[800px] mx-auto"
    }, null, 3, null), 1, "i8_0"),
    /* @__PURE__ */ _jsxQ("section", null, {
      class: "flex justify-center pb-6"
    }, /* @__PURE__ */ _jsxQ("button", null, {
      class: "bg-btn-bg rounded-full px-6 py-3 font-serif font-semibold text-sm text-navy border-none cursor-pointer hover:opacity-80 transition-opacity",
      onClick$: /* @__PURE__ */ _noopQrl("s_zn27NCIZ3BA", [
        categoriesOpen
      ])
    }, "EXPLORE OUR EXPERIENCE CATEGORIES", 3, null), 3, null),
    categoriesOpen.value && /* @__PURE__ */ _jsxC(CategoriesModal, {
      onClose: /* @__PURE__ */ inlinedQrl(s_5s110co2AxQ, "s_5s110co2AxQ", [
        categoriesOpen
      ])
    }, 3, "i8_1"),
    /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1080px] mx-auto pt-[50px] pb-2.5 px-4"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "flex justify-end pb-5"
    }, /* @__PURE__ */ _jsxQ("select", null, {
      value: _fnSignal((p0) => p0.value, [
        selectedCategory
      ], "p0.value"),
      class: "w-[300px] h-[50px] border-2 border-navy bg-white font-sans font-light text-base tracking-[1.5px] text-navy px-3 cursor-pointer appearance-none bg-[length:24px] bg-no-repeat bg-[right_12px_center]",
      style: {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2330324B' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`
      },
      onChange$: /* @__PURE__ */ _noopQrl("s_fRBzDZnG9FE", [
        nav,
        selectedCategory
      ])
    }, CATEGORIES.map((cat) => /* @__PURE__ */ _jsxQ("option", {
      value: _wrapSignal(cat, "value")
    }, null, cat.label, 1, cat.value || "default")), 1, null), 1, null), 1, null),
    /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-4 pb-[50px]"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      id: "experience-grid-container",
      class: "flex flex-wrap gap-2.5 justify-start"
    }, filteredExperiences.map((exp) => /* @__PURE__ */ _jsxC(ExperienceCard, {
      exp,
      width: cardWidth
    }, 3, exp.slug)), 1, null), 1, null),
    cp.description && /* @__PURE__ */ _jsxQ("section", null, {
      class: "bg-white"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "py-12 px-4 text-center"
      }, /* @__PURE__ */ _jsxQ("div", null, {
        class: "max-w-[900px] mx-auto"
      }, [
        /* @__PURE__ */ _jsxQ("h2", null, {
          class: "font-serif font-semibold text-xl text-navy mb-3 m-0"
        }, cp.title || "Cancellation Policy", 1, null),
        /* @__PURE__ */ _jsxQ("div", {
          dangerouslySetInnerHTML: renderPolicyMarkdown(cp.description)
        }, null, null, 3, null)
      ], 1, null), 1, null),
      /* @__PURE__ */ _jsxC(FooterLogo, null, 3, "i8_2")
    ], 1, "i8_3"),
    !cp.description && /* @__PURE__ */ _jsxC(FooterLogo, null, 3, "i8_4")
  ], 1, "i8_5");
};
const index$1 = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl(s_B0lqk5IDDy4, "s_B0lqk5IDDy4"));
const head$1 = {
  title: "Experience Collection | 360° Travel inspirations",
  meta: [
    {
      name: "description",
      content: "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic Costa Rican adventure."
    },
    {
      property: "og:title",
      content: "Experience Collection"
    },
    {
      property: "og:description",
      content: "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic Costa Rican adventure."
    },
    {
      property: "og:image",
      content: "/images/thumbnailNLA_(1)_(1).png"
    },
    {
      property: "og:type",
      content: "website"
    },
    {
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      name: "twitter:title",
      content: "Experience Collection"
    },
    {
      name: "twitter:description",
      content: "We customize your day with no timetables to follow, no crowds and no scripts, just an authentic Costa Rican adventure."
    },
    {
      name: "twitter:image",
      content: "/images/thumbnailNLA_(1)_(1).png"
    }
  ]
};
const IndexRoute = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _auto_CATEGORIES: CATEGORIES,
  _auto_DEFAULT_CP: DEFAULT_CP,
  _auto_DEFAULT_HP: DEFAULT_HP,
  _auto_filterExperiences: filterExperiences,
  _auto_resolveCardWidth: resolveCardWidth,
  default: index$1,
  head: head$1,
  useHomeData
}, Symbol.toStringTag, { value: "Module" }));
const s_Mp6Xq57ftKs = async (requestEvent) => {
  const slug = requestEvent.params.slug;
  const exp = await getExperienceBySlug(slug);
  return {
    experience: exp
  };
};
const useExperienceData = routeLoaderQrl(/* @__PURE__ */ inlinedQrl(s_Mp6Xq57ftKs, "s_Mp6Xq57ftKs"));
function getSafeVideoEmbedUrl(videoLink) {
  if (!videoLink) return "";
  try {
    const url = new URL(videoLink);
    const shouldMute = url.searchParams.get("autoplay") === "1" || /youtube|youtu\.be|vimeo/i.test(url.hostname);
    if (shouldMute) {
      url.searchParams.set("mute", "1");
      url.searchParams.set("muted", "1");
    }
    return url.toString();
  } catch {
    return videoLink;
  }
}
const s_1yCc8pq10ig = (index2) => {
  const [galleryIndex, galleryOpen] = useLexicalScope();
  galleryIndex.value = index2;
  galleryOpen.value = true;
};
const s_Fmts7kQlE5g = () => {
  const [galleryOpen] = useLexicalScope();
  galleryOpen.value = false;
};
const s_CrhZZpQDDk8 = () => {
  const [galleryIndex, images] = useLexicalScope();
  galleryIndex.value = galleryIndex.value === 0 ? images.length - 1 : galleryIndex.value - 1;
};
const s_XYqHXyj9nwU = () => {
  const [galleryIndex, images] = useLexicalScope();
  galleryIndex.value = galleryIndex.value === images.length - 1 ? 0 : galleryIndex.value + 1;
};
const s_ym7Eqvig3S0 = () => {
  _jsxBranch();
  const data = useExperienceData();
  const exp = data.value.experience;
  const galleryOpen = useSignal(false);
  const galleryIndex = useSignal(0);
  if (!exp) return /* @__PURE__ */ _jsxQ("div", null, {
    class: "flex items-center justify-center min-h-[50vh]"
  }, /* @__PURE__ */ _jsxQ("p", null, {
    class: "text-navy text-lg"
  }, "Experience not found.", 3, null), 3, "RR_0");
  const images = [
    exp.featuredImage,
    exp.photo1,
    exp.photo2,
    exp.photo3,
    exp.photo4
  ].filter(Boolean);
  const tags = [
    {
      key: "thrilling",
      label: "thrilling",
      icon: "/images/webExperinceCollectionfinal-10.svg"
    },
    {
      key: "hike",
      label: "hike",
      icon: "/images/webExperinceCollectionfinal-11.svg"
    },
    {
      key: "floraAndFauna",
      label: "flora&fauna",
      icon: "/images/flora&fauna.svg"
    },
    {
      key: "relax",
      label: "relax",
      icon: "/images/webExperinceCollectionfinal-13.svg"
    },
    {
      key: "water",
      label: "water",
      icon: "/images/webExperinceCollectionfinal-14.svg"
    },
    {
      key: "cultural",
      label: "cultural",
      icon: "/images/webExperinceCollectionfinal-15.svg"
    },
    {
      key: "gourmet",
      label: "gourmet",
      icon: "/images/webExperinceCollectionfinal-16.svg"
    }
  ].filter((tag) => exp[tag.key]);
  const openGallery = /* @__PURE__ */ inlinedQrl(s_1yCc8pq10ig, "s_1yCc8pq10ig", [
    galleryIndex,
    galleryOpen
  ]);
  const closeGallery = /* @__PURE__ */ inlinedQrl(s_Fmts7kQlE5g, "s_Fmts7kQlE5g", [
    galleryOpen
  ]);
  const goToPreviousImage = /* @__PURE__ */ inlinedQrl(s_CrhZZpQDDk8, "s_CrhZZpQDDk8", [
    galleryIndex,
    images
  ]);
  const goToNextImage = /* @__PURE__ */ inlinedQrl(s_XYqHXyj9nwU, "s_XYqHXyj9nwU", [
    galleryIndex,
    images
  ]);
  const videoEmbedUrl = getSafeVideoEmbedUrl(exp.videoLink);
  return /* @__PURE__ */ _jsxQ("div", null, null, [
    /* @__PURE__ */ _jsxQ("section", null, {
      class: "relative w-full min-h-[500px] overflow-hidden"
    }, [
      /* @__PURE__ */ _jsxQ("img", {
        src: _wrapSignal(exp, "featuredImage"),
        alt: _wrapSignal(exp, "title")
      }, {
        class: "absolute inset-0 w-full h-full object-cover",
        width: 1920,
        height: 1080
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "relative z-10 flex flex-col items-center justify-end min-h-[500px] pb-24 px-6 text-center"
      }, [
        /* @__PURE__ */ _jsxQ("img", null, {
          src: "/images/Logo_Gordo_(1).png",
          alt: "Logo",
          class: "w-[100px] h-auto mb-4",
          width: 100,
          height: 100
        }, null, 3, null),
        /* @__PURE__ */ _jsxQ("h1", null, {
          class: "font-serif font-semibold text-white text-3xl md:text-5xl lg:text-6xl mb-2"
        }, _wrapSignal(exp, "title"), 1, null),
        /* @__PURE__ */ _jsxQ("p", null, {
          class: "font-sans font-light text-white text-xl md:text-3xl"
        }, _wrapSignal(exp, "shortDescription"), 1, null)
      ], 1, null)
    ], 1, null),
    /* @__PURE__ */ _jsxQ("section", null, {
      class: "bg-navy py-5"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "flex flex-wrap items-center justify-center gap-4 px-4"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-2 text-white"
      }, [
        /* @__PURE__ */ _jsxQ("img", null, {
          src: "/images/pin.png",
          alt: "",
          class: "h-[55px] w-auto",
          width: 55,
          height: 55
        }, null, 3, null),
        /* @__PURE__ */ _jsxQ("span", null, {
          class: "text-lg"
        }, _wrapSignal(exp, "location"), 1, null)
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "hidden md:block w-px h-[50px] bg-white/30"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-3"
      }, [
        exp.halfDay && /* @__PURE__ */ _jsxQ("img", null, {
          src: "/images/dayicon-05.png",
          alt: "Half day",
          class: "h-[70px] w-auto",
          width: 70,
          height: 70
        }, null, 3, "RR_1"),
        exp.threeQuartersDay && /* @__PURE__ */ _jsxQ("img", null, {
          src: "/images/dayicon-06.png",
          alt: "3/4 day",
          class: "h-[70px] w-auto",
          width: 70,
          height: 70
        }, null, 3, "RR_2"),
        exp.fullDay && /* @__PURE__ */ _jsxQ("img", null, {
          src: "/images/dayicon-07.png",
          alt: "Full day",
          class: "h-[70px] w-auto",
          width: 70,
          height: 70
        }, null, 3, "RR_3")
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "hidden md:block w-px h-[50px] bg-white/30"
      }, null, 3, null),
      exp.groups && exp.groupPrice ? /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-2 text-white"
      }, [
        /* @__PURE__ */ _jsxQ("img", null, {
          src: "https://ec-dragoscloud.b-cdn.net/groupicon.png",
          alt: "",
          class: "h-9 w-auto brightness-0 invert",
          width: 36,
          height: 36
        }, null, 3, null),
        /* @__PURE__ */ _jsxQ("span", null, {
          class: "text-lg"
        }, [
          "$",
          _wrapSignal(exp, "groupPrice")
        ], 1, null)
      ], 1, "RR_4") : /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-4 text-white"
      }, [
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex items-center gap-2"
        }, [
          /* @__PURE__ */ _jsxQ("img", null, {
            src: "/images/webExperinceCollectionfinal-06.png",
            alt: "",
            class: "h-[55px] w-auto",
            width: 55,
            height: 55
          }, null, 3, null),
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "text-lg"
          }, [
            "$",
            _wrapSignal(exp, "price1to2")
          ], 1, null)
        ], 1, null),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "hidden md:block w-px h-[50px] bg-white/30"
        }, null, 3, null),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex items-center gap-2"
        }, [
          /* @__PURE__ */ _jsxQ("img", null, {
            src: "/images/webExperinceCollectionfinal-07.png",
            alt: "",
            class: "h-[55px] w-auto",
            width: 55,
            height: 55
          }, null, 3, null),
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "text-lg"
          }, [
            "$",
            _wrapSignal(exp, "price3to6")
          ], 1, null)
        ], 1, null),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "hidden md:block w-px h-[50px] bg-white/30"
        }, null, 3, null),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex items-center gap-2"
        }, [
          /* @__PURE__ */ _jsxQ("img", null, {
            src: "/images/webExperinceCollectionfinal-08.png",
            alt: "",
            class: "h-[55px] w-auto",
            width: 55,
            height: 55
          }, null, 3, null),
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "text-lg"
          }, [
            "$",
            _wrapSignal(exp, "price7")
          ], 1, null)
        ], 1, null)
      ], 1, null)
    ], 1, null), 1, null),
    tags.length > 0 && /* @__PURE__ */ _jsxQ("section", null, {
      class: "bg-white py-12"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "max-w-[1200px] mx-auto flex flex-wrap justify-center gap-2.5 px-4"
    }, tags.map((tag) => /* @__PURE__ */ _jsxQ("div", null, {
      class: "flex items-center gap-2"
    }, [
      /* @__PURE__ */ _jsxQ("img", {
        src: _wrapSignal(tag, "icon"),
        alt: _wrapSignal(tag, "label")
      }, {
        class: "h-[45px] w-auto",
        width: 55,
        height: 55
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("span", null, {
        class: "text-lg text-navy"
      }, _wrapSignal(tag, "label"), 1, null)
    ], 1, tag.key)), 1, null), 1, "RR_5"),
    exp.overview && /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-5 pb-12"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-full h-px bg-gold mb-4"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-3 mb-5"
      }, [
        /* @__PURE__ */ _jsxQ("h2", null, {
          class: "font-sans font-bold text-gold text-[28px]"
        }, "OVERVIEW", 3, null),
        /* @__PURE__ */ _jsxQ("button", {
          onClick$: /* @__PURE__ */ _noopQrl("s_tSg0p1g1K1Q", [
            exp
          ])
        }, {
          class: "text-gold bg-transparent border-none cursor-pointer p-1",
          "aria-label": "Copy overview"
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "w-5 h-5"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
        }, null, 3, null), 3, null), 2, null)
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", {
        dangerouslySetInnerHTML: renderMarkdown(exp.overview)
      }, {
        class: "font-sans text-xl text-navy leading-relaxed max-w-none"
      }, null, 3, null)
    ], 1, "RR_6"),
    exp.activities.length > 0 && /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-5 pb-12"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-full h-px bg-gold mb-4"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-3 mb-5"
      }, [
        /* @__PURE__ */ _jsxQ("h2", null, {
          class: "font-sans font-bold text-gold text-[28px]"
        }, "ACTIVITIES", 3, null),
        /* @__PURE__ */ _jsxQ("button", {
          onClick$: /* @__PURE__ */ _noopQrl("s_HcMnXYFGXa0", [
            exp
          ])
        }, {
          class: "text-gold bg-transparent border-none cursor-pointer p-1",
          "aria-label": "Copy activities"
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "w-5 h-5"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
        }, null, 3, null), 3, null), 2, null)
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "font-sans text-xl text-navy leading-relaxed"
      }, exp.activities.map((a, i) => /* @__PURE__ */ _jsxQ("div", null, {
        class: "mb-1"
      }, convertWhatsAppMarkdown(a), 1, i)), 1, null)
    ], 1, "RR_7"),
    exp.includes.length > 0 && /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-5 pb-12"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-full h-px bg-gold mb-4"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-3 mb-5"
      }, [
        /* @__PURE__ */ _jsxQ("h2", null, {
          class: "font-sans font-bold text-gold text-[28px]"
        }, "INCLUDES", 3, null),
        /* @__PURE__ */ _jsxQ("button", {
          onClick$: /* @__PURE__ */ _noopQrl("s_Tdrk02CDQz0", [
            exp
          ])
        }, {
          class: "text-gold bg-transparent border-none cursor-pointer p-1",
          "aria-label": "Copy includes"
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "w-5 h-5"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
        }, null, 3, null), 3, null), 2, null)
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "font-sans text-xl text-navy leading-relaxed"
      }, exp.includes.map((item, i) => /* @__PURE__ */ _jsxQ("div", null, {
        class: "mb-1"
      }, convertWhatsAppMarkdown(item), 1, i)), 1, null)
    ], 1, "RR_8"),
    exp.whatToBring.length > 0 && /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-5 pb-12"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-full h-px bg-gold mb-4"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex items-center gap-3 mb-5"
      }, [
        /* @__PURE__ */ _jsxQ("h2", null, {
          class: "font-sans font-bold text-gold text-[28px]"
        }, "WHAT TO BRING?", 3, null),
        /* @__PURE__ */ _jsxQ("button", {
          onClick$: /* @__PURE__ */ _noopQrl("s_tND5EXI5sUo", [
            exp
          ])
        }, {
          class: "text-gold bg-transparent border-none cursor-pointer p-1",
          "aria-label": "Copy what to bring"
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "w-5 h-5"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
        }, null, 3, null), 3, null), 2, null)
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "font-sans text-xl text-navy leading-relaxed hidden md:block"
      }, /* @__PURE__ */ _jsxQ("div", null, {
        class: "grid grid-cols-3 gap-2.5"
      }, exp.whatToBring.map((item, i) => /* @__PURE__ */ _jsxQ("div", null, {
        class: "p-3 border border-gray-200"
      }, convertWhatsAppMarkdown(item), 1, i)), 1, null), 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "font-sans text-xl text-navy leading-relaxed md:hidden"
      }, exp.whatToBring.map((item, i) => /* @__PURE__ */ _jsxQ("div", null, {
        class: "mb-1"
      }, convertWhatsAppMarkdown(item), 1, i)), 1, null)
    ], 1, "RR_9"),
    images.length > 0 && /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-5 pb-12"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-full h-px bg-gold mb-4"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("h2", null, {
        class: "font-sans font-bold text-gold text-[28px] mb-5"
      }, "PHOTO GALLERY", 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "flex flex-wrap justify-center gap-2.5"
      }, images.map((img, i) => /* @__PURE__ */ _jsxQ("button", {
        onClick$: /* @__PURE__ */ _noopQrl("s_KdW9mE13kTs", [
          i,
          openGallery
        ])
      }, {
        class: "group overflow-hidden rounded-[22px] border-none p-0 cursor-pointer bg-transparent shadow-[0_18px_45px_rgba(48,50,75,0.12)]"
      }, /* @__PURE__ */ _jsxQ("img", {
        src: img,
        alt: `Photo ${i + 1}`
      }, {
        class: "w-[220px] h-[150px] object-cover transition-transform duration-300 group-hover:scale-[1.04]",
        width: 220,
        height: 150,
        loading: "lazy"
      }, null, 3, null), 0, i)), 1, null)
    ], 1, "RR_10"),
    videoEmbedUrl && /* @__PURE__ */ _jsxQ("section", null, {
      class: "max-w-[1200px] mx-auto px-5 pb-12"
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-full h-px bg-gold mb-4"
      }, null, 3, null),
      /* @__PURE__ */ _jsxQ("h2", null, {
        class: "font-sans font-bold text-gold text-[28px] mb-5"
      }, "VIDEO", 3, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "w-[80%] mx-auto aspect-video"
      }, /* @__PURE__ */ _jsxQ("iframe", {
        src: videoEmbedUrl
      }, {
        class: "w-full h-full border-0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullscreen: true,
        title: "Experience video"
      }, null, 3, null), 1, null)
    ], 1, "RR_11"),
    galleryOpen.value && /* @__PURE__ */ _jsxQ("div", null, {
      class: "fixed inset-0 z-50 bg-[rgba(12,16,22,0.92)] backdrop-blur-sm",
      onClick$: closeGallery
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "flex min-h-full items-center justify-center p-4 md:p-8"
    }, /* @__PURE__ */ _jsxQ("div", null, {
      class: "relative w-full max-w-[1380px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,27,35,0.98)_0%,rgba(10,14,20,0.98)_100%)] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-6",
      onClick$: /* @__PURE__ */ _noopQrl("s_irviHl2eZhc")
    }, [
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "mb-4 flex items-center justify-between gap-4"
      }, [
        /* @__PURE__ */ _jsxQ("div", null, null, [
          /* @__PURE__ */ _jsxQ("p", null, {
            class: "m-0 font-sans text-xs font-semibold uppercase tracking-[0.26em] text-gold/70"
          }, "Photo gallery", 3, null),
          /* @__PURE__ */ _jsxQ("p", null, {
            class: "mt-2 mb-0 font-serif text-lg text-white md:text-2xl"
          }, _wrapSignal(exp, "title"), 1, null)
        ], 1, null),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex items-center gap-3"
        }, [
          /* @__PURE__ */ _jsxQ("span", null, {
            class: "rounded-full border border-white/10 bg-white/5 px-4 py-2 font-sans text-sm text-white/75"
          }, [
            _fnSignal((p0) => p0.value + 1, [
              galleryIndex
            ], "p0.value+1"),
            " / ",
            _wrapSignal(images, "length")
          ], 1, null),
          /* @__PURE__ */ _jsxQ("button", null, {
            class: "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold transition-colors hover:bg-white/10",
            "aria-label": "Close gallery",
            onClick$: closeGallery
          }, /* @__PURE__ */ _jsxQ("svg", null, {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": 1.5,
            stroke: "currentColor",
            class: "w-7 h-7"
          }, /* @__PURE__ */ _jsxQ("path", null, {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            d: "M6 18L18 6M6 6l12 12"
          }, null, 3, null), 3, null), 3, null)
        ], 1, null)
      ], 1, null),
      /* @__PURE__ */ _jsxQ("div", null, {
        class: "relative overflow-hidden rounded-[24px] bg-black/30"
      }, [
        images.length > 1 && /* @__PURE__ */ _jsxQ("button", null, {
          class: "absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 md:left-5 md:h-14 md:w-14",
          "aria-label": "Previous photo",
          onClick$: goToPreviousImage
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "h-7 w-7"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15.75 19.5L8.25 12l7.5-7.5"
        }, null, 3, null), 3, null), 3, "RR_12"),
        /* @__PURE__ */ _jsxQ("div", null, {
          class: "flex items-center justify-center px-12 py-4 md:px-20 md:py-6"
        }, /* @__PURE__ */ _jsxQ("img", {
          src: images[galleryIndex.value]
        }, {
          alt: _fnSignal((p0) => `Photo ${p0.value + 1}`, [
            galleryIndex
          ], "`Photo ${p0.value+1}`"),
          class: "max-h-[72vh] w-auto max-w-full rounded-[18px] object-contain",
          width: 1200,
          height: 800
        }, null, 3, null), 1, null),
        images.length > 1 && /* @__PURE__ */ _jsxQ("button", null, {
          class: "absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 md:right-5 md:h-14 md:w-14",
          "aria-label": "Next photo",
          onClick$: goToNextImage
        }, /* @__PURE__ */ _jsxQ("svg", null, {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": 1.5,
          stroke: "currentColor",
          class: "h-7 w-7"
        }, /* @__PURE__ */ _jsxQ("path", null, {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M8.25 4.5l7.5 7.5-7.5 7.5"
        }, null, 3, null), 3, null), 3, "RR_13")
      ], 1, null),
      images.length > 1 && /* @__PURE__ */ _jsxQ("div", null, {
        class: "mt-5 flex gap-3 overflow-x-auto pb-1"
      }, images.map((img, i) => /* @__PURE__ */ _jsxQ("button", {
        class: `shrink-0 overflow-hidden rounded-2xl border transition-all ${i === galleryIndex.value ? "border-gold shadow-[0_0_0_2px_rgba(222,210,155,0.2)]" : "border-white/10 opacity-70 hover:opacity-100"}`,
        "aria-label": `Go to photo ${i + 1}`,
        onClick$: /* @__PURE__ */ _noopQrl("s_ourkneE48Ew", [
          galleryIndex,
          i
        ])
      }, null, /* @__PURE__ */ _jsxQ("img", {
        src: img,
        alt: `Thumbnail ${i + 1}`
      }, {
        class: "h-20 w-24 object-cover md:h-24 md:w-32",
        width: 128,
        height: 96,
        loading: "lazy"
      }, null, 3, null), 0, i)), 1, "RR_14")
    ], 1, null), 1, null), 1, "RR_15"),
    /* @__PURE__ */ _jsxC(FooterLogo, null, 3, "RR_16")
  ], 1, "RR_17");
};
const index = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl(s_ym7Eqvig3S0, "s_ym7Eqvig3S0"));
const head = {
  title: "Experience | Experience Collection",
  meta: [
    {
      name: "description",
      content: "Experience details"
    },
    {
      property: "og:type",
      content: "website"
    },
    {
      name: "twitter:card",
      content: "summary_large_image"
    }
  ]
};
const ExperienceSlugRoute = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _auto_getSafeVideoEmbedUrl: getSafeVideoEmbedUrl,
  default: index,
  head,
  useExperienceData
}, Symbol.toStringTag, { value: "Module" }));
const serverPlugins = [];
const Layout = () => Layout_;
const routes = [
  ["/", [Layout, () => IndexRoute], "/", []],
  ["experience/[slug]/", [Layout, () => ExperienceSlugRoute], "/experience/[slug]/", []]
];
const menus = [];
const trailingSlash = true;
const basePathname = "/";
const cacheModules = true;
const qwikCityPlan = { routes, serverPlugins, menus, trailingSlash, basePathname, cacheModules };
export {
  basePathname,
  cacheModules,
  qwikCityPlan as default,
  menus,
  routes,
  serverPlugins,
  trailingSlash
};
