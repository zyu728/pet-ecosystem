import Link from 'next/link'
import type { Pet } from '@/types'

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link href={`/pets/${pet.id}`} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 active:scale-[0.98] transition-all">
      <span className="text-3xl">{pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐹'}</span>
      <div className="flex-1"><p className="font-semibold">{pet.name}</p><p className="text-xs text-gray-400">{pet.breed} · {pet.age}个月 · {pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : ''}</p></div>
      <span className="text-gray-300">→</span>
    </Link>
  )
}
