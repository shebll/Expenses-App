/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AnalyticsImport } from './routes/analytics'

// Create Virtual Routes

const LogsLazyImport = createFileRoute('/logs')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const LogsLazyRoute = LogsLazyImport.update({
  path: '/logs',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/logs.lazy').then((d) => d.Route))

const AnalyticsRoute = AnalyticsImport.update({
  path: '/analytics',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/analytics': {
      id: '/analytics'
      path: '/analytics'
      fullPath: '/analytics'
      preLoaderRoute: typeof AnalyticsImport
      parentRoute: typeof rootRoute
    }
    '/logs': {
      id: '/logs'
      path: '/logs'
      fullPath: '/logs'
      preLoaderRoute: typeof LogsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  AnalyticsRoute,
  LogsLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/analytics",
        "/logs"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/analytics": {
      "filePath": "analytics.tsx"
    },
    "/logs": {
      "filePath": "logs.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
