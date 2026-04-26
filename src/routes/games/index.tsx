import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-dusty-grape-50 px-6 py-10">
      {/* Title */}
      <h1 className="text-center text-8xl font-bold text-dusty-grape-900 mb-10 tracking-tight">
        Games
      </h1>

      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Description Box */}
        <div className="border-3 border-prussian-blue-600 bg-dusty-grape-100 p-8">
          <p className="text-dusty-grape-900 text-base leading-relaxed">
            The Games section serves as a way for users to apply what they know about rhythm in
            practical ways. Within Games, there is: Drum Machine and a live musician game, the
            Whitney Houston Challenge.
          </p>
        </div>

        {/* Pages Box */}
        <div className="border-3 border-prussian-blue-600 border-t-0 bg-dusty-grape-100 p-8">
          <div className="flex flex-col gap-5">
            {/* Drum Machine card */}
            <div className="bg-dusty-lavender-100 border-2 border-prussian-blue-400 p-5 rounded">
              <h2 className="text-lg font-semibold text-prussian-blue-800 mb-2">Drum Machine</h2>
              <p className="text-dusty-grape-900 text-sm leading-relaxed">
                The Drum Machine is a tool that lets the user create a drum part using samples of
                instruments. This lets the user test out drum parts to see if they sound as good as
                it did in their head.
              </p>
            </div>

            {/* Whitney Houston Challenge card */}
            <div className="bg-dusty-lavender-100 border-2 border-prussian-blue-400 p-5 rounded">
              <h2 className="text-lg font-semibold text-prussian-blue-800 mb-2">
                The Whitney Houston Challenge
              </h2>
              <p className="text-dusty-grape-900 text-sm leading-relaxed">
                The Whitney Houston Challenge is a game where the user has to hit the floor tom at
                the same time as Ricky Lawson does! If you get it, you can keep the job; otherwise,
                you're fired!!!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
