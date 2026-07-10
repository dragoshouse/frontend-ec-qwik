import type {
  Experience,
  HomePageContent,
  CancellationPolicy,
} from "./types";

const PROJECT_ID = "catallog-experiences";
const API_KEY = "AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI";

function parseFirestoreValue(
  fields: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.integerValue !== undefined)
      result[key] = Number(val.integerValue);
    else if (val.doubleValue !== undefined) result[key] = val.doubleValue;
    else if (val.booleanValue !== undefined) result[key] = val.booleanValue;
    else if (val.timestampValue !== undefined) result[key] = val.timestampValue;
    else if (val.arrayValue !== undefined) {
      result[key] = (val.arrayValue.values || []).map(
        (v: any) => parseFirestoreValue({ _: v })._,
      );
    } else if (val.nullValue !== undefined) result[key] = null;
    else result[key] = null;
  }
  return result;
}

function decodeFlexibleBool(val: any): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") return val.toLowerCase() === "true";
  return false;
}

// Server-side in-memory cache (survives between requests in same Cloud Function instance)
const serverCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 60_000; // 60 seconds

function getCached<T>(key: string): T | null {
  const entry = serverCache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data as T;
  serverCache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  serverCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

async function fetchCollection<T>(collection: string): Promise<T[]> {
  const cached = getCached<T[]>(collection);
  if (cached) return cached;

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?key=${API_KEY}`;

  const res = await fetch(url);
  const data = (await res.json()) as {
    documents?: Array<{ fields: Record<string, any> }>;
  };

  if (!data.documents) return [];

  const results = data.documents.map((doc) => {
    const parsed = parseFirestoreValue(doc.fields);
    return parsed as unknown as T;
  });

  setCache(collection, results);
  return results;
}

async function fetchSingleDocument<T>(
  collection: string,
): Promise<T | null> {
  const docs = await fetchCollection<T>(collection);
  return docs.length > 0 ? docs[0] : null;
}

function parseCreatedAt(value: string): number {
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

export async function getExperiences(): Promise<Experience[]> {
  const docs = await fetchCollection<any>("experiences");

  const mapped = docs
    .map((doc) => ({
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
      createdAt: doc.createdAt || "",
    }))
    .filter((e) => e.status);

  return mapped.sort(
    (a, b) => parseCreatedAt(b.createdAt) - parseCreatedAt(a.createdAt),
  );
}

export async function getExperienceBySlug(
  slug: string,
): Promise<Experience | null> {
  const experiences = await getExperiences();
  return experiences.find((e) => e.slug === slug) || null;
}

export async function getHomePageContent(): Promise<HomePageContent | null> {
  return fetchSingleDocument<HomePageContent>("home_page");
}

export async function getCancellationPolicy(): Promise<CancellationPolicy | null> {
  return fetchSingleDocument<CancellationPolicy>("cancellation_policy");
}
