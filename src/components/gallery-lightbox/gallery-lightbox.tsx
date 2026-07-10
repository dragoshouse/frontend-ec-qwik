import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  type Signal,
} from "@builder.io/qwik";

interface GalleryLightboxProps {
  images: string[];
  title: string;
  isOpen: Signal<boolean>;
  currentIndex: Signal<number>;
}

export const GalleryLightbox = component$<GalleryLightboxProps>(
  ({ images, title, isOpen, currentIndex }) => {
    const isAnimating = useSignal(false);

    const handlePrev = $(() => {
      if (isAnimating.value || images.length <= 1) return;
      isAnimating.value = true;
      currentIndex.value =
        currentIndex.value === 0 ? images.length - 1 : currentIndex.value - 1;
      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    });

    const handleNext = $(() => {
      if (isAnimating.value || images.length <= 1) return;
      isAnimating.value = true;
      currentIndex.value =
        currentIndex.value === images.length - 1 ? 0 : currentIndex.value + 1;
      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    });

    const closeLightbox = $(() => {
      isOpen.value = false;
    });

    // Keyboard support
    useVisibleTask$(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen.value) return;
        if (e.key === "ArrowLeft") {
          handlePrev();
        } else if (e.key === "ArrowRight") {
          handleNext();
        } else if (e.key === "Escape") {
          closeLightbox();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    });

    if (!isOpen.value) return null;

    const currentImage = images[currentIndex.value];

    return (
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-4"
        onClick$={closeLightbox}
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery lightbox"
      >
        {/* Main container */}
        <div
          class="relative w-full max-w-7xl h-full md:h-auto flex flex-col"
          onClick$={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div class="flex items-center justify-between mb-3 md:mb-4 px-2 md:px-0">
            <div class="flex-1">
              <p class="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Photo Gallery
              </p>
              <h3 class="text-lg md:text-2xl font-serif font-semibold text-white mt-1 truncate">
                {title}
              </h3>
            </div>

            {/* Counter & Close */}
            <div class="flex items-center gap-3 md:gap-4 ml-4">
              <div class="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span class="text-xs md:text-sm font-medium text-white">
                  {currentIndex.value + 1}
                  <span class="text-white/50 mx-1">/</span>
                  {images.length}
                </span>
              </div>

              <button
                onClick$={closeLightbox}
                class="p-2 md:p-2.5 hover:bg-white/10 rounded-full transition-colors duration-200 flex-shrink-0"
                aria-label="Close gallery"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 md:w-6 md:h-6 text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div class="flex-1 flex items-center justify-center relative rounded-lg md:rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm min-h-[300px] md:min-h-0">
            {/* Image with fade transition */}
            <img
              src={currentImage}
              alt={`Photo ${currentIndex.value + 1}`}
              class={`max-h-[70vh] w-auto max-w-full object-contain select-none pointer-events-none transition-all duration-300 ${
                isAnimating.value ? "opacity-50 scale-95" : "opacity-100 scale-100"
              }`}
              width={1200}
              height={800}
            />

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick$={handlePrev}
                  disabled={isAnimating.value}
                  class={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all duration-200 disabled:opacity-50 ${
                    isAnimating.value
                      ? "bg-white/5 text-white/50"
                      : "bg-white/10 hover:bg-white/20 text-white hover:scale-110"
                  }`}
                  aria-label="Previous photo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick$={handleNext}
                  disabled={isAnimating.value}
                  class={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all duration-200 disabled:opacity-50 ${
                    isAnimating.value
                      ? "bg-white/5 text-white/50"
                      : "bg-white/10 hover:bg-white/20 text-white hover:scale-110"
                  }`}
                  aria-label="Next photo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Keyboard hint */}
            <div class="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-xs text-white/40 hidden md:block">
              ← → arrow keys • ESC to close
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div class="mt-3 md:mt-4 flex gap-2 md:gap-3 overflow-x-auto pb-1 px-2 md:px-0 snap-x snap-mandatory">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick$={() => {
                    if (!isAnimating.value) {
                      currentIndex.value = i;
                    }
                  }}
                  class={`shrink-0 overflow-hidden rounded-lg md:rounded-xl transition-all duration-200 snap-start ${
                    i === currentIndex.value
                      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black scale-105"
                      : "opacity-60 hover:opacity-90 border border-white/20"
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === currentIndex.value}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    class="w-16 h-12 md:w-24 md:h-20 object-cover"
                    width={96}
                    height={80}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
