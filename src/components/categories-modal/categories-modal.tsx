import { component$, type PropFunction } from "@builder.io/qwik";

interface CategoriesModalProps {
  onClose: PropFunction<() => void>;
}

export const CategoriesModal = component$<CategoriesModalProps>(({ onClose }) => {
  return (
    <div class="fixed inset-0 z-[60] bg-btn-bg flex flex-col">
      <button
        onClick$={onClose}
        class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/50 border-none cursor-pointer flex items-center justify-center"
        aria-label="Close categories"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-7 h-7 text-black">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
        <img
          src="https://ec-dragoscloud.b-cdn.net/ExperienceCategories.png"
          alt="Experience Categories"
          class="max-w-full max-h-full object-contain"
          width={1200}
          height={800}
        />
      </div>
    </div>
  );
});
