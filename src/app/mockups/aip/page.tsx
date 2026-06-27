import { notFound } from "next/navigation";
import AipMockupShell from "@/components/mockups/aip/AipMockupShell";

export default function AipMockupPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07080a] px-5 py-10 text-fg md:px-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[12px] uppercase tracking-[0.12em] text-mute">Local preview</p>
          <h1 className="m-0 type-h2 text-fg">AIP hero mockup</h1>
          <p className="m-0 max-w-[720px] type-body-lg text-mute">
            A standalone AIP mock app for the homepage hero. This route is available only in local development.
          </p>
        </div>

        <AipMockupShell />
      </div>
    </main>
  );
}
