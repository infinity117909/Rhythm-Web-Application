import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: RootNotFound,
})

function RootNotFound() {
  return (
    <main className="min-h-screen bg-soft-linen-50 px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border-3 border-soft-linen-600 bg-porcelain-50 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-soft-linen-700">404</p>
        <h1 className="mt-2 text-3xl font-bold text-soft-linen-900">Page not found</h1>
        <p className="mt-3 text-soft-linen-800">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-lg bg-soft-linen-700 px-4 py-2 font-semibold text-porcelain-50 hover:bg-soft-linen-800"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
              
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
