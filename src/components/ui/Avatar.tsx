interface AvatarProps { src?: string | null; name?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }
  if (src) return <img src={src} alt={name || ''} className={`${sizes[size]} rounded-full object-cover`} />
  return <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium`}>{name?.slice(0, 2) || '🐾'}</div>
}
