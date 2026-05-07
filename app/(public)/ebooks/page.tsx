import { getFormations } from '@/lib/admin-data'
import EbooksClient from './EbooksClient'

export const dynamic = 'force-dynamic'

export default function EbooksPage() {
  const ebooks = getFormations().filter((f) => f.type === 'ebook')
  return <EbooksClient ebooks={ebooks} />
}
