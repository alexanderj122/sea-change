import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        This is the Main page
        <Link href="/ship-page">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Go to Ship Page
          </button>
        </Link>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        This is the Footer
      </footer>
    </div>
  );
}
