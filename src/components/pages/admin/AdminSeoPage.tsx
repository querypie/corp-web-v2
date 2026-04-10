"use client";

import { useMemo, useRef, useState } from "react";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import Input from "../../common/Input";
import LoadingText from "../../common/LoadingText";
import TabGroup from "../../common/TabGroup";
import Textarea from "../../common/Textarea";
import Tab from "../../common/Tab";
import {
  persistSeoPageDefinitions,
  resetSeoEntry,
  upsertSeoEntry,
  useSeoEntries,
  useSeoPageDefinitions,
} from "@/features/seo/clientStore";
import { type SeoDiscoveryCandidate, type SeoEntry, type SeoPageDefinition, type SeoPageKey } from "@/features/seo/data";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function AdminSeoPage() {
  const definitions = useSeoPageDefinitions();
  const entries = useSeoEntries();
  const [selectedKey, setSelectedKey] = useState<SeoPageKey>("home");
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
  const [ogImageName, setOgImageName] = useState("");
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [definitionsError, setDefinitionsError] = useState("");
  const [discoveryCandidates, setDiscoveryCandidates] = useState<SeoDiscoveryCandidate[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentEntry = useMemo(
    () => entries.find((entry) => entry.key === selectedKey) ?? entries[0],
    [entries, selectedKey],
  );
  const ogImageDisplayValue = ogImageName || currentEntry?.ogImage || "";

  const currentDefinition = definitions.find((item) => item.key === selectedKey);

  function updateEntry(patch: Partial<SeoEntry>) {
    if (!currentEntry) return;
    upsertSeoEntry({
      ...currentEntry,
      ...patch,
      title: {
        ...currentEntry.title,
        ...patch.title,
      },
      description: {
        ...currentEntry.description,
        ...patch.description,
      },
      ogTitle: {
        ...currentEntry.ogTitle,
        ...patch.ogTitle,
      },
      ogDescription: {
        ...currentEntry.ogDescription,
        ...patch.ogDescription,
      },
    });
  }

  function handleOgImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !currentEntry) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateEntry({ ogImage: reader.result });
        setOgImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  async function discoverPages() {
    setIsDiscovering(true);
    setDefinitionsError("");

    try {
      const response = await fetch("/api/admin/seo/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ definitions }),
      });
      if (!response.ok) {
        throw new Error("페이지 탐색에 실패했습니다.");
      }

      const data = (await response.json()) as { candidates: SeoDiscoveryCandidate[] };
      setDiscoveryCandidates(data.candidates);
      setShowDiscoveryModal(true);
    } catch (error) {
      setDefinitionsError(error instanceof Error ? error.message : "페이지 탐색에 실패했습니다.");
    } finally {
      setIsDiscovering(false);
    }
  }

  function addDiscoveredDefinition(definition: SeoPageDefinition) {
    const nextDefinitions = [...definitions, definition];
    persistSeoPageDefinitions(nextDefinitions);
    setDiscoveryCandidates((current) => current.filter((item) => item.key !== definition.key));
  }

  function removeDefinition(key: SeoPageKey) {
    const nextDefinitions = definitions.filter((definition) => definition.key !== key);
    persistSeoPageDefinitions(nextDefinitions);

    if (selectedKey === key) {
      setSelectedKey((nextDefinitions[0]?.key as SeoPageKey) ?? "home");
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <AdminHeader
        description="퍼블릭 주요 페이지의 메타데이터와 검색 노출 요소를 페이지별로 관리합니다."
        title="SEO"
      />

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <div className="flex flex-wrap gap-2 md:flex-col md:gap-px">
            {definitions.map((item) => (
              <button
                key={item.key}
                className={cx(
                  "inline-flex w-full items-center rounded-button px-3 py-2 text-left type-body-md transition-colors",
                  item.key === selectedKey
                    ? "bg-secondary text-fg"
                    : "text-mute-fg hover:bg-[#242426] hover:text-fg",
                )}
                onClick={() => setSelectedKey(item.key)}
                type="button"
              >
                <div className="text-inherit">{item.label}</div>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <Button
              arrow={false}
              className="w-full justify-center"
              onClick={discoverPages}
              style="round"
              variant="outline"
            >
              {isDiscovering ? <LoadingText text="탐색 중..." /> : "미등록 페이지 탐색"}
            </Button>
          </div>
        </div>

        {currentEntry ? (
          <div className="flex flex-col gap-5 rounded-[20px] border border-border bg-bg-content p-5 md:p-6 xl:pl-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="m-0 type-h3 text-fg">{currentDefinition?.label}</h2>
                <p className="m-0 mt-2 type-body-md text-mute-fg">{currentDefinition?.description}</p>
              </div>
              <TabGroup>
                {(["en", "ko", "ja"] as const).map((locale) => (
                  <Tab key={locale} onClick={() => setActiveLocale(locale)} state={activeLocale === locale ? "on" : "off"}>
                    {locale.toUpperCase()}
                  </Tab>
                ))}
              </TabGroup>
            </div>

            <div className="grid gap-5">
              <label className="flex flex-col gap-[10px]">
                <span className="type-body-md text-fg">Meta Title</span>
                <Input
                  className="w-full bg-bg"
                  onChange={(event) =>
                    updateEntry({ title: { [activeLocale]: event.target.value } as SeoEntry["title"] })
                  }
                  value={currentEntry.title[activeLocale]}
                />
              </label>

              <label className="flex flex-col gap-[10px]">
                <span className="type-body-md text-fg">Meta Description</span>
                <Textarea
                  className="min-h-[120px] resize-y bg-bg"
                  onChange={(event) =>
                    updateEntry({
                      description: { [activeLocale]: event.target.value } as SeoEntry["description"],
                    })
                  }
                  value={currentEntry.description[activeLocale]}
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-[10px]">
                  <span className="type-body-md text-fg">OG Title</span>
                  <Input
                    className="w-full bg-bg"
                    onChange={(event) =>
                      updateEntry({ ogTitle: { [activeLocale]: event.target.value } as SeoEntry["ogTitle"] })
                    }
                    value={currentEntry.ogTitle[activeLocale]}
                  />
                </label>

                <div className="flex flex-col gap-[10px]">
                  <span className="type-body-md text-fg">OG Image</span>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex min-w-0 h-10 flex-1 items-center rounded-button border border-transparent bg-bg px-3">
                      <span className="truncate type-body-md text-mute-fg">
                        {ogImageDisplayValue}
                      </span>
                    </div>
                    <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} style="round" variant="outline">
                      추가
                    </Button>
                  </div>
                  <input
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleOgImageChange}
                    ref={fileInputRef}
                    type="file"
                  />
                </div>
              </div>

              <label className="flex flex-col gap-[10px]">
                <span className="type-body-md text-fg">OG Description</span>
                <Textarea
                  className="min-h-[120px] resize-y bg-bg"
                  onChange={(event) =>
                    updateEntry({
                      ogDescription: { [activeLocale]: event.target.value } as SeoEntry["ogDescription"],
                    })
                  }
                  value={currentEntry.ogDescription[activeLocale]}
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex items-center justify-between rounded-box bg-bg px-4 py-3">
                  <span className="type-body-md text-fg">Index</span>
                  <input checked={currentEntry.robotsIndex} onChange={(event) => updateEntry({ robotsIndex: event.target.checked })} type="checkbox" />
                </label>
                <label className="flex items-center justify-between rounded-box bg-bg px-4 py-3">
                  <span className="type-body-md text-fg">Follow</span>
                  <input checked={currentEntry.robotsFollow} onChange={(event) => updateEntry({ robotsFollow: event.target.checked })} type="checkbox" />
                </label>
              </div>

              <div className="rounded-[20px] bg-bg px-5 py-5">
                <p className="m-0 type-body-sm text-mute-fg">SERP Preview</p>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="m-0 type-body-sm text-success">querypie.ai / {currentDefinition?.key}</p>
                  <p className="m-0 type-h3 text-[#8ab4f8]">{currentEntry.title[activeLocale] || "Title"}</p>
                  <p className="m-0 type-body-md text-mute-fg">{currentEntry.description[activeLocale] || "Description"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 type-body-sm text-mute-fg">실시간 적용</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button arrow={false} onClick={() => resetSeoEntry(currentEntry.key)} style="round" variant="outline">
                    SEO 기본값으로 초기화
                  </Button>
                  <Button arrow={false} onClick={() => removeDefinition(currentEntry.key)} style="round" variant="secondary">
                    SEO 관리 목록에서 제외
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {showDiscoveryModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-4 sm:px-5">
          <div
            className="flex w-full max-w-[520px] flex-col gap-4 rounded-modal border border-border bg-[var(--color-bg-modal)] p-5 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <h3 className="m-0 type-h3 text-fg">추가 가능한 페이지</h3>
              <p className="m-0 mt-2 type-body-md text-mute-fg">
                SEO 정의에 아직 등록되지 않은 퍼블릭 페이지입니다.
              </p>
            </div>

            <div className="flex max-h-[360px] flex-col gap-2 overflow-auto">
              {discoveryCandidates.length > 0 ? (
                discoveryCandidates.map((candidate) => (
                  <div key={`${candidate.routePattern}-${candidate.matchMode}`} className="rounded-button bg-bg-content px-4 py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="m-0 type-body-md text-fg">{candidate.label}</p>
                        <p className="m-0 mt-1 type-body-sm text-mute-fg">
                          {candidate.routePattern || "/"} · {candidate.matchMode}
                        </p>
                      </div>
                      <Button arrow={false} onClick={() => addDiscoveredDefinition(candidate)} style="round" variant="outline">
                        추가
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex min-h-[180px] items-center justify-center text-center">
                  <p className="m-0 type-body-md text-mute-fg">추가 가능한 새 페이지가 없습니다.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button arrow={false} onClick={() => setShowDiscoveryModal(false)} style="round" variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
