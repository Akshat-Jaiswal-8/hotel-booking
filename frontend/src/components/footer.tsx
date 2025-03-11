import React from "react";

export const Footer = (): React.ReactNode => {
  return (
    <section>
      <div
        className={
          "flex h-[var(--nav-height)] items-center justify-center gap-x-2 border-t border-dotted border-t-slate-800 py-6 font-poppins text-slate-800 dark:text-slate-300 text-xs md:text-xl"
        }
      >
        © 2025 Reserve go. Made with{" "}
        <span className={"text-2xl text-blue-500"}> ♥</span> by Akshat.
      </div>
    </section>
  );
};
