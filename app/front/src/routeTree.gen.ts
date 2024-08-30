/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthEleveInscriptionImport } from './routes/_auth/eleve/_inscription'
import { Route as AuthFormationsFormationIdIndexImport } from './routes/_auth/formations/$formationId/index'

// Create Virtual Routes

const AuthEleveImport = createFileRoute('/_auth/eleve')()
const AuthIndexLazyImport = createFileRoute('/_auth/')()
const AuthProfilIndexLazyImport = createFileRoute('/_auth/profil/')()
const AuthEleveInscriptionInscriptionScolariteIndexLazyImport = createFileRoute(
  '/_auth/eleve/_inscription/inscription/scolarite/',
)()
const AuthEleveInscriptionInscriptionProjetIndexLazyImport = createFileRoute(
  '/_auth/eleve/_inscription/inscription/projet/',
)()
const AuthEleveInscriptionInscriptionMetiersIndexLazyImport = createFileRoute(
  '/_auth/eleve/_inscription/inscription/metiers/',
)()
const AuthEleveInscriptionInscriptionInteretsIndexLazyImport = createFileRoute(
  '/_auth/eleve/_inscription/inscription/interets/',
)()
const AuthEleveInscriptionInscriptionFormationsIndexLazyImport =
  createFileRoute('/_auth/eleve/_inscription/inscription/formations/')()
const AuthEleveInscriptionInscriptionEtudeIndexLazyImport = createFileRoute(
  '/_auth/eleve/_inscription/inscription/etude/',
)()
const AuthEleveInscriptionInscriptionDomainesIndexLazyImport = createFileRoute(
  '/_auth/eleve/_inscription/inscription/domaines/',
)()
const AuthEleveInscriptionInscriptionConfirmationIndexLazyImport =
  createFileRoute('/_auth/eleve/_inscription/inscription/confirmation/')()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthEleveRoute = AuthEleveImport.update({
  path: '/eleve',
  getParentRoute: () => AuthRoute,
} as any)

const AuthIndexLazyRoute = AuthIndexLazyImport.update({
  path: '/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth/index.lazy').then((d) => d.Route))

const AuthProfilIndexLazyRoute = AuthProfilIndexLazyImport.update({
  path: '/profil/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/profil/index.lazy').then((d) => d.Route),
)

const AuthEleveInscriptionRoute = AuthEleveInscriptionImport.update({
  id: '/_inscription',
  getParentRoute: () => AuthEleveRoute,
} as any)

const AuthFormationsFormationIdIndexRoute =
  AuthFormationsFormationIdIndexImport.update({
    path: '/formations/$formationId/',
    getParentRoute: () => AuthRoute,
  } as any).lazy(() =>
    import('./routes/_auth/formations/$formationId/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthEleveInscriptionInscriptionScolariteIndexLazyRoute =
  AuthEleveInscriptionInscriptionScolariteIndexLazyImport.update({
    path: '/inscription/scolarite/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/scolarite/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionProjetIndexLazyRoute =
  AuthEleveInscriptionInscriptionProjetIndexLazyImport.update({
    path: '/inscription/projet/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/projet/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionMetiersIndexLazyRoute =
  AuthEleveInscriptionInscriptionMetiersIndexLazyImport.update({
    path: '/inscription/metiers/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/metiers/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionInteretsIndexLazyRoute =
  AuthEleveInscriptionInscriptionInteretsIndexLazyImport.update({
    path: '/inscription/interets/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/interets/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionFormationsIndexLazyRoute =
  AuthEleveInscriptionInscriptionFormationsIndexLazyImport.update({
    path: '/inscription/formations/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/formations/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionEtudeIndexLazyRoute =
  AuthEleveInscriptionInscriptionEtudeIndexLazyImport.update({
    path: '/inscription/etude/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/etude/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionDomainesIndexLazyRoute =
  AuthEleveInscriptionInscriptionDomainesIndexLazyImport.update({
    path: '/inscription/domaines/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/domaines/index.lazy'
    ).then((d) => d.Route),
  )

const AuthEleveInscriptionInscriptionConfirmationIndexLazyRoute =
  AuthEleveInscriptionInscriptionConfirmationIndexLazyImport.update({
    path: '/inscription/confirmation/',
    getParentRoute: () => AuthEleveInscriptionRoute,
  } as any).lazy(() =>
    import(
      './routes/_auth/eleve/_inscription/inscription/confirmation/index.lazy'
    ).then((d) => d.Route),
  )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/eleve': {
      id: '/_auth/eleve'
      path: '/eleve'
      fullPath: '/eleve'
      preLoaderRoute: typeof AuthEleveImport
      parentRoute: typeof AuthImport
    }
    '/_auth/eleve/_inscription': {
      id: '/_auth/eleve/_inscription'
      path: '/eleve'
      fullPath: '/eleve'
      preLoaderRoute: typeof AuthEleveInscriptionImport
      parentRoute: typeof AuthEleveRoute
    }
    '/_auth/profil/': {
      id: '/_auth/profil/'
      path: '/profil'
      fullPath: '/profil'
      preLoaderRoute: typeof AuthProfilIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/formations/$formationId/': {
      id: '/_auth/formations/$formationId/'
      path: '/formations/$formationId'
      fullPath: '/formations/$formationId'
      preLoaderRoute: typeof AuthFormationsFormationIdIndexImport
      parentRoute: typeof AuthImport
    }
    '/_auth/eleve/_inscription/inscription/confirmation/': {
      id: '/_auth/eleve/_inscription/inscription/confirmation/'
      path: '/inscription/confirmation'
      fullPath: '/eleve/inscription/confirmation'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionConfirmationIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/domaines/': {
      id: '/_auth/eleve/_inscription/inscription/domaines/'
      path: '/inscription/domaines'
      fullPath: '/eleve/inscription/domaines'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionDomainesIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/etude/': {
      id: '/_auth/eleve/_inscription/inscription/etude/'
      path: '/inscription/etude'
      fullPath: '/eleve/inscription/etude'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionEtudeIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/formations/': {
      id: '/_auth/eleve/_inscription/inscription/formations/'
      path: '/inscription/formations'
      fullPath: '/eleve/inscription/formations'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionFormationsIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/interets/': {
      id: '/_auth/eleve/_inscription/inscription/interets/'
      path: '/inscription/interets'
      fullPath: '/eleve/inscription/interets'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionInteretsIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/metiers/': {
      id: '/_auth/eleve/_inscription/inscription/metiers/'
      path: '/inscription/metiers'
      fullPath: '/eleve/inscription/metiers'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionMetiersIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/projet/': {
      id: '/_auth/eleve/_inscription/inscription/projet/'
      path: '/inscription/projet'
      fullPath: '/eleve/inscription/projet'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionProjetIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
    '/_auth/eleve/_inscription/inscription/scolarite/': {
      id: '/_auth/eleve/_inscription/inscription/scolarite/'
      path: '/inscription/scolarite'
      fullPath: '/eleve/inscription/scolarite'
      preLoaderRoute: typeof AuthEleveInscriptionInscriptionScolariteIndexLazyImport
      parentRoute: typeof AuthEleveInscriptionImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({
    AuthIndexLazyRoute,
    AuthEleveRoute: AuthEleveRoute.addChildren({
      AuthEleveInscriptionRoute: AuthEleveInscriptionRoute.addChildren({
        AuthEleveInscriptionInscriptionConfirmationIndexLazyRoute,
        AuthEleveInscriptionInscriptionDomainesIndexLazyRoute,
        AuthEleveInscriptionInscriptionEtudeIndexLazyRoute,
        AuthEleveInscriptionInscriptionFormationsIndexLazyRoute,
        AuthEleveInscriptionInscriptionInteretsIndexLazyRoute,
        AuthEleveInscriptionInscriptionMetiersIndexLazyRoute,
        AuthEleveInscriptionInscriptionProjetIndexLazyRoute,
        AuthEleveInscriptionInscriptionScolariteIndexLazyRoute,
      }),
    }),
    AuthProfilIndexLazyRoute,
    AuthFormationsFormationIdIndexRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/",
        "/_auth/eleve",
        "/_auth/profil/",
        "/_auth/formations/$formationId/"
      ]
    },
    "/_auth/": {
      "filePath": "_auth/index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/eleve": {
      "filePath": "_auth/eleve",
      "parent": "/_auth",
      "children": [
        "/_auth/eleve/_inscription"
      ]
    },
    "/_auth/eleve/_inscription": {
      "filePath": "_auth/eleve/_inscription.tsx",
      "parent": "/_auth/eleve",
      "children": [
        "/_auth/eleve/_inscription/inscription/confirmation/",
        "/_auth/eleve/_inscription/inscription/domaines/",
        "/_auth/eleve/_inscription/inscription/etude/",
        "/_auth/eleve/_inscription/inscription/formations/",
        "/_auth/eleve/_inscription/inscription/interets/",
        "/_auth/eleve/_inscription/inscription/metiers/",
        "/_auth/eleve/_inscription/inscription/projet/",
        "/_auth/eleve/_inscription/inscription/scolarite/"
      ]
    },
    "/_auth/profil/": {
      "filePath": "_auth/profil/index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/formations/$formationId/": {
      "filePath": "_auth/formations/$formationId/index.tsx",
      "parent": "/_auth"
    },
    "/_auth/eleve/_inscription/inscription/confirmation/": {
      "filePath": "_auth/eleve/_inscription/inscription/confirmation/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/domaines/": {
      "filePath": "_auth/eleve/_inscription/inscription/domaines/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/etude/": {
      "filePath": "_auth/eleve/_inscription/inscription/etude/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/formations/": {
      "filePath": "_auth/eleve/_inscription/inscription/formations/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/interets/": {
      "filePath": "_auth/eleve/_inscription/inscription/interets/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/metiers/": {
      "filePath": "_auth/eleve/_inscription/inscription/metiers/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/projet/": {
      "filePath": "_auth/eleve/_inscription/inscription/projet/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    },
    "/_auth/eleve/_inscription/inscription/scolarite/": {
      "filePath": "_auth/eleve/_inscription/inscription/scolarite/index.lazy.tsx",
      "parent": "/_auth/eleve/_inscription"
    }
  }
}
ROUTE_MANIFEST_END */
