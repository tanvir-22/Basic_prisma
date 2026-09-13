import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neo-bg">
      <div className="w-full max-w-4xl flex flex-col gap-8 text-center my-12 md:my-24">
        {/* Logo Tag */}
        <div className="self-center">
          <span className="bg-neo-pink text-black text-sm font-black uppercase tracking-widest border-4 border-black px-4 py-2 shadow-neo-sm select-none">
            LEARNING PROJECT // BASELINE APPLICATION
          </span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-black select-none leading-none">
          DEVELOPER{" "}
          <span className="bg-neo-yellow px-4 border-4 border-black inline-block rotate-[-2deg] my-2">
            NOTEBOOK
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xl md:text-2xl font-bold leading-relaxed text-black">
          A high-contrast, structured note-taking system built server-first
          using the latest Next.js App Router and Tailwind CSS, backed by simple
          in-memory dummy data.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" variant="green" className="w-full sm:w-auto">
                Go to Dashboard (Logged in as {user.name})
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button size="lg" variant="yellow" className="w-full sm:w-auto">
                  Login to Account
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="pink" className="w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <Card bg="bg-white">
            <span className="text-xs font-black bg-neo-cyan border-2 border-black px-2 py-0.5 shadow-neo-sm mb-4 inline-block">
              SERVER RENDERED
            </span>
            <h3 className="text-xl font-black uppercase mb-2">
              Server-First Design
            </h3>
            <p className="font-semibold text-sm leading-relaxed text-zinc-700">
              No client-side state hooks for fetching or list rendering. Pages
              are fully server-side rendered by default.
            </p>
          </Card>

          <Card bg="bg-white">
            <span className="text-xs font-black bg-neo-green border-2 border-black px-2 py-0.5 shadow-neo-sm mb-4 inline-block">
              URL ROUTING
            </span>
            <h3 className="text-xl font-black uppercase mb-2">
              URL-Driven State
            </h3>
            <p className="font-semibold text-sm leading-relaxed text-zinc-700">
              Searches, active tags, and listings synchronize directly to the
              URL. Perfect for instant revalidation and clean routing.
            </p>
          </Card>

          <Card bg="bg-white">
            <span className="text-xs font-black bg-neo-yellow border-2 border-black px-2 py-0.5 shadow-neo-sm mb-4 inline-block">
              IN-MEMORY DATA
            </span>
            <h3 className="text-xl font-black uppercase mb-2">
              Dummy Data Layer
            </h3>
            <p className="font-semibold text-sm leading-relaxed text-zinc-700">
              Server actions read and write a simple in-memory array. Swap it
              out for your own database code as practice.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
