// 线性 SVG 图标系统 — 1.5px stroke, 24x24 viewBox
interface IconProps { size?: number; className?: string; strokeWidth?: number }

const base = (size: number, className: string, sw: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
)

export const IconMap = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <path d="M9 20l-5.5-5.5a2.1 2.1 0 010-3L9 6" />
    <path d="M15 20l5.5-5.5a2.1 2.1 0 000-3L15 6" />
    <path d="M3 12h18" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </>
))

export const IconCommunity = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
    <path d="M12 12v3" />
  </>
))

export const IconSearch = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </>
))

export const IconChat = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.2 0-2.3-.2-3.3-.7L4 21l1.7-5.2a8.5 8.5 0 1115.3-4.3z" />
  </>
))

export const IconUser = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.8-3.2 3.4-5 7-5s6.2 1.8 7 5" />
  </>
))

export const IconSettings = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </>
))

export const IconLocate = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <circle cx="12" cy="12" r="7.5" />
  </>
))

export const IconBack = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <path d="M15 5l-7 7 7 7" />
))

export const IconClose = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <path d="M6 6l12 12M18 6L6 18" />
))

export const IconPlus = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <path d="M12 5v14M5 12h14" />
))

export const IconCamera = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </>
))

export const IconHeart = ({ size = 24, className = '', strokeWidth = 1.5, filled = false }: IconProps & { filled?: boolean }) => base(size, className, strokeWidth, (
  <path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0112 6.5a4.4 4.4 0 018.5 2.4C20.5 15 12 20.5 12 20.5z" fill={filled ? 'currentColor' : 'none'} />
))

export const IconBell = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" />
    <path d="M10 19a2 2 0 004 0" />
  </>
))

export const IconNavigate = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <>
    <path d="M12 2l5.5 18L12 15l-5.5 5z" />
    <path d="M12 15V2" />
  </>
))

export const IconPhone = ({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) => base(size, className, strokeWidth, (
  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
))
