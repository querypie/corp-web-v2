"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { japanHomeFaqCopy } from "@/copy/homeJapan";

function ExpandIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path d="M4 10h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path
        className={`origin-center transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "scale-y-0" : "scale-y-100"}`}
        d="M10 4v12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function JapanLingoFaq() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);
  const categoryButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeCategory = japanHomeFaqCopy.categories[activeCategoryIndex];

  const selectCategory = (categoryIndex: number) => {
    setActiveCategoryIndex(categoryIndex);
    setOpenQuestionIndex(null);
  };

  const handleCategoryKeyDown = (event: KeyboardEvent<HTMLButtonElement>, categoryIndex: number) => {
    const lastCategoryIndex = japanHomeFaqCopy.categories.length - 1;
    let nextCategoryIndex: number | undefined;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextCategoryIndex = categoryIndex === lastCategoryIndex ? 0 : categoryIndex + 1;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextCategoryIndex = categoryIndex === 0 ? lastCategoryIndex : categoryIndex - 1;
    } else if (event.key === "Home") {
      nextCategoryIndex = 0;
    } else if (event.key === "End") {
      nextCategoryIndex = lastCategoryIndex;
    }

    if (nextCategoryIndex === undefined) return;

    event.preventDefault();
    selectCategory(nextCategoryIndex);
    categoryButtonRefs.current[nextCategoryIndex]?.focus();
  };

  return (
    <section
      aria-label="Lingoのよくあるご質問"
      className="w-full"
      data-testid="japan-lingo-faq"
    >
      <div className="grid min-w-0 gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12 lg:gap-16">
        <div
          aria-label="FAQカテゴリー"
          className="-mx-5 flex w-[calc(100%+40px)] min-w-0 max-w-none gap-1 overflow-x-auto px-5 pb-2 scroll-px-5 md:mx-0 md:w-auto md:max-w-full md:flex-col md:overflow-visible md:px-0 md:pb-0"
          role="tablist"
        >
          {japanHomeFaqCopy.categories.map((category, categoryIndex) => {
            const isActive = categoryIndex === activeCategoryIndex;

            return (
              <button
                aria-controls="lingo-faq-panel"
                aria-selected={isActive}
                className={`min-h-11 shrink-0 cursor-pointer rounded-button px-5 py-2 text-left type-body-md font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:transition-none md:w-full ${isActive ? "bg-primary text-bg" : "bg-transparent text-mute hover:bg-bg-hover hover:text-fg"}`}
                id={`lingo-faq-tab-${categoryIndex + 1}`}
                key={category.title}
                onClick={() => selectCategory(categoryIndex)}
                onKeyDown={(event) => handleCategoryKeyDown(event, categoryIndex)}
                ref={(element) => {
                  categoryButtonRefs.current[categoryIndex] = element;
                }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                {category.title}
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`lingo-faq-tab-${activeCategoryIndex + 1}`}
          className="flex flex-col gap-3"
          id="lingo-faq-panel"
          key={activeCategory.title}
          role="tabpanel"
        >
          {activeCategory.items.map((item, itemIndex) => {
            const isOpen = itemIndex === openQuestionIndex;
            const answerId = `lingo-faq-answer-${activeCategoryIndex + 1}-${itemIndex + 1}`;

            return (
              <article className="overflow-hidden rounded-box bg-bg-content" key={item.question}>
                <button
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left text-fg outline-none transition-colors duration-200 hover:text-brand focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand motion-reduce:transition-none md:px-6 md:py-4"
                  onClick={() => setOpenQuestionIndex((currentIndex) => currentIndex === itemIndex ? null : itemIndex)}
                  type="button"
                >
                  <span className="min-w-0 text-pretty type-body-lg font-semibold leading-relaxed">{item.question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-fg">
                    <ExpandIcon isOpen={isOpen} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pr-14 md:px-6 md:pb-6 md:pr-16" id={answerId}>
                    <div className="flex flex-col gap-3 type-body-lg leading-relaxed text-mute">
                      {item.answer.map((paragraph) => (
                        <p className="m-0 text-pretty" key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
