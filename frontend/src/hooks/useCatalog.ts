import { useEffect, useState } from 'react'
import fallback from '../../../shared/catalog.json'
import { api } from '../services/api'
import type { Catalog } from '../types'

/** Live catalog from the API (admin-editable), falling back to the bundled seed data. */
export function useCatalog(): Catalog {
  const [catalog, setCatalog] = useState<Catalog>(fallback as Catalog)
  useEffect(() => {
    api<Catalog>('/catalog').then(setCatalog).catch(() => {})
  }, [])
  return catalog
}
