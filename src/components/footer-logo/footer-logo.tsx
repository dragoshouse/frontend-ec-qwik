import { component$ } from "@builder.io/qwik";

export const FooterLogo = component$(() => {
  return (
    <div class="w-full h-[170px] bg-nav-bg flex items-center justify-center shrink-0">
      <a
        href="https://nolimitadventurescr.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/images/Logo_Gordo_(1).png"
          alt="No Limit Adventures"
          class="h-20 w-auto"
          width={80}
          height={80}
        />
      </a>
    </div>
  );
});
