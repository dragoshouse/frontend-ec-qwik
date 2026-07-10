import {
  createQwikCity,
  type PlatformFirebase,
} from "@builder.io/qwik-city/middleware/firebase";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";

declare global {
  type QwikCityPlatform = PlatformFirebase;
}

export default createQwikCity({ render, qwikCityPlan });
