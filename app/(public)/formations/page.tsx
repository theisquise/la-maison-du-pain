import { getFormations } from '@/lib/admin-data'
import FormationsClient from './FormationsClient'

export const dynamic = 'force-dynamic'

export default function FormationsPage() {
  const formations = getFormations().filter((f) => f.type === 'formation')
  return <FormationsClient formations={formations} />
}
