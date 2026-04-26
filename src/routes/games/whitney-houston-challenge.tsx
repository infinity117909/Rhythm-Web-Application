import { createFileRoute } from "@tanstack/react-router";
import YouTubeTomDetector from "@/whitney-houston-challenge/YouTubeTomDetector";

export const Route = createFileRoute("/games/whitney-houston-challenge")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-[var(--color-dusty-grape-950)] px-4 py-8 text-[var(--color-dusty-lavender-50)] md:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-900)] p-4 md:p-6">
        <header className="rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] px-6 py-8 text-center md:px-10 md:py-10">
          <h1 className="text-2xl font-semibold text-[var(--color-dusty-lavender-50)] md:text-3xl">Hit on the beat!</h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-[var(--color-dusty-lavender-200)] md:text-base">
            DIRECTIONS: Count the beats, listen for the embellishment, and click the tom at the exact moment.
          </p>
        </header>

        <section className="mt-4 rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] p-4 md:p-6">
          <div className="mx-auto max-w-[760px] rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-900)] p-4 md:p-5">
            <div className="[&_button]:mx-auto [&_button]:mt-4 [&_button]:block [&_button]:rounded-xl [&_button]:border [&_button]:border-[var(--color-azure-mist-400)] [&_button]:bg-[var(--color-azure-mist-500)] [&_button]:px-5 [&_button]:py-2 [&_button]:font-semibold [&_button]:text-[var(--color-dusty-grape-950)] [&_button]:transition-colors [&_button]:hover:bg-[var(--color-azure-mist-400)] [&_svg]:mx-auto">
              <YouTubeTomDetector
                videoId="3JWTaaS7LdU"
                tomTimestamp={189.8}
                onTomHit={() => console.log(`Floor tom hit at 189.8s!`)}
              />
            </div>            
          </div>
        </section>
      </div>
    </div>
  );
}
