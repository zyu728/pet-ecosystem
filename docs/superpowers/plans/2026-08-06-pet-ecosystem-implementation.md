# 商丘宠物生态平台 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建以商丘市为首发城市的宠物生态 Web App，以地图为核心入口，整合店铺/医院POI、宠物档案、私信、GPS追踪。

**Architecture:** Next.js 14 App Router + Tailwind CSS 移动端优先前端，Supabase 提供 Auth/数据库/实时通信/存储，高德地图 JS API 2.0 驱动地图功能，Vercel 部署。

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3, Supabase, 高德地图 JS API 2.0, Vercel

**约束:** Solo 开发者，零技术基础，AI 工具辅助编码。

---

## 文件结构总览

```
pet-ecosystem/
├── .env.local                          # 环境变量 (Supabase URL/Key, 高德 Key)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # 根布局 (Supabase Provider + 全局样式)
│   │   ├── globals.css                 # Tailwind + 自定义样式
│   │   ├── page.tsx                    # 入口 → 重定向到 /map
│   │   ├── auth/
│   │   │   ├── login/page.tsx          # 登录页
│   │   │   └── callback/route.ts       # Auth 回调
│   │   ├── map/page.tsx                # 地图首页 (Tab 1)
│   │   ├── discover/page.tsx           # 发现页 (Tab 2)
│   │   ├── messages/
│   │   │   ├── page.tsx                # 会话列表 (Tab 3)
│   │   │   └── [id]/page.tsx           # 聊天详情
│   │   ├── profile/page.tsx            # 个人中心 (Tab 4)
│   │   ├── shops/[id]/page.tsx         # 店铺详情
│   │   ├── pets/
│   │   │   ├── new/page.tsx            # 创建宠物
│   │   │   ├── [id]/page.tsx           # 宠物详情
│   │   │   ├── [id]/edit/page.tsx      # 编辑宠物
│   │   │   └── tracking/page.tsx       # 宠物追踪地图
│   │   └── orders/page.tsx             # 我的订单
│   ├── components/
│   │   ├── layout/
│   │   │   └── TabBar.tsx              # 底部导航栏
│   │   ├── map/
│   │   │   ├── PetMap.tsx              # 地图容器
│   │   │   ├── MapSearch.tsx           # 搜索覆盖层
│   │   │   └── MarkerFilter.tsx        # 标记筛选器
│   │   ├── shop/
│   │   │   ├── ShopCard.tsx            # 列表卡片
│   │   │   ├── ShopInfoWindow.tsx      # 地图弹窗
│   │   │   └── ProductCard.tsx         # 商品卡片
│   │   ├── pet/
│   │   │   ├── PetCard.tsx             # 宠物档案卡片
│   │   │   └── PetForm.tsx             # 创建/编辑表单
│   │   ├── chat/
│   │   │   ├── ConversationList.tsx    # 会话列表
│   │   │   └── ChatWindow.tsx          # 聊天窗口
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Avatar.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # 浏览器端 Supabase client
│   │   │   └── middleware.ts           # Auth 中间件
│   │   ├── db/
│   │   │   ├── profiles.ts
│   │   │   ├── pets.ts
│   │   │   ├── shops.ts
│   │   │   ├── messages.ts
│   │   │   ├── tracking.ts
│   │   │   └── orders.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useShops.ts
│   │   │   ├── usePets.ts
│   │   │   ├── useMessages.ts
│   │   │   └── useTracking.ts
│   │   └── utils/
│   │       └── helpers.ts
│   └── types/
│       └── index.ts                    # 全部类型定义
├── supabase/
│   └── migrations/
│       └── 00001_initial_schema.sql    # 数据库建表
└── public/
    └── icons/                          # 地图标记图标
```

---

## Phase 0: 项目初始化

### Task 0.1: 创建 Next.js 项目并安装依赖

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`

- [ ] **Step 1: 使用 create-next-app 初始化项目**

```bash
cd /Users/yu/pet-ecosystem
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: 脚手架创建成功，package.json 就位。

- [ ] **Step 2: 安装核心依赖**

```bash
cd /Users/yu/pet-ecosystem
npm install @supabase/supabase-js @supabase/ssr
```

Expected: 依赖安装成功。

- [ ] **Step 3: 创建 .env.local 环境变量文件**

创建 `/Users/yu/pet-ecosystem/.env.local`：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_AMAP_KEY=your_amap_key
NEXT_PUBLIC_AMAP_VERSION=2.0
```

- [ ] **Step 4: 提交**

```bash
cd /Users/yu/pet-ecosystem
git init && git add -A && git commit -m "chore: init Next.js 14 project with Supabase and Tailwind"
```

---

### Task 0.2: 配置 TypeScript 类型和 Tailwind

**Files:**
- Create: `src/types/index.ts`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: 创建全局类型定义**

创建 `/Users/yu/pet-ecosystem/src/types/index.ts`：

```typescript
// ===== 数据库行类型 =====

export type ShopType = 'pet_shop' | 'pet_hospital' | 'grooming'

export interface Profile {
  id: string
  nickname: string | null
  avatar_url: string | null
  phone: string | null
  is_subscribed: boolean
  lat: number | null
  lng: number | null
  created_at: string
}

export interface Pet {
  id: string
  owner_id: string
  name: string
  species: 'dog' | 'cat' | 'other'
  breed: string | null
  age: number | null
  gender: 'male' | 'female' | null
  weight: number | null
  avatar_url: string | null
  photos: string[]
  vaccine_records: VaccineRecord[]
  allergies: string | null
  created_at: string
}

export interface VaccineRecord {
  name: string
  date: string
  next_date?: string
}

export interface Shop {
  id: string
  name: string
  type: ShopType
  address: string
  lat: number
  lng: number
  phone: string | null
  business_hours: string | null
  rating: number
  cover_image: string | null
  description: string | null
  created_at: string
}

export interface ShopProduct {
  id: string
  shop_id: string
  name: string
  category: 'food' | 'supplies' | 'medicine' | 'service'
  price: number
  image: string | null
  delivery_available: boolean
  created_at: string
}

export interface TrackingCollar {
  id: string
  owner_id: string
  pet_id: string
  device_serial: string
  battery_level: number
  last_ping_at: string | null
  created_at: string
}

export interface TrackingRecord {
  id: string
  collar_id: string
  lat: number
  lng: number
  recorded_at: string
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  last_message_at: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_url: string | null
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  shop_id: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'delivering' | 'done'
  delivery_address: string
  created_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

// ===== 地图相关类型 =====

export type MarkerType = 'hospital' | 'shop' | 'pet'

export interface MapMarker {
  id: string
  type: MarkerType
  lat: number
  lng: number
  name: string
  info?: string
}

// ===== 筛选类型 =====

export type ShopFilter = 'all' | 'pet_shop' | 'pet_hospital' | 'grooming'
```

- [ ] **Step 2: 配置 Tailwind 主题色**

修改 `/Users/yu/pet-ecosystem/tailwind.config.ts`：

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#f9d7a5',
          300: '#f5ba6d',
          400: '#f09432',
          500: '#ec7a0f',
          600: '#dd6005',
          700: '#b74808',
          800: '#92390d',
          900: '#76300e',
        },
        paw: {
          green: '#4CAF50',
          blue: '#2196F3',
          red: '#F44336',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      screens: {
        'mobile': { max: '768px' },
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 3: 更新全局样式**

修改 `/Users/yu/pet-ecosystem/src/app/globals.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body {
    @apply h-full w-full m-0 p-0;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    @apply bg-gray-50 text-gray-900 font-sans;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* 移动端优先：最大宽度限制 */
  #__next, main {
    @apply min-h-full;
    max-width: 480px;
    margin: 0 auto;
  }
}

@layer components {
  .tab-bar {
    @apply fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200;
    @apply flex justify-around items-center;
    @apply h-14 safe-area-bottom;
  }

  .tab-item {
    @apply flex flex-col items-center justify-center;
    @apply text-xs text-gray-500;
    @apply transition-colors duration-200;
  }

  .tab-item.active {
    @apply text-primary-500;
  }

  .map-container {
    @apply w-full;
    height: calc(100vh - 56px);
  }

  .info-window {
    @apply bg-white rounded-lg shadow-lg p-3;
    @apply min-w-[200px] max-w-[280px];
  }

  .shop-card {
    @apply bg-white rounded-xl shadow-sm p-4;
    @apply active:scale-[0.98] transition-transform;
  }
}

@layer utilities {
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}
```

- [ ] **Step 4: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add TypeScript types, Tailwind config, and global styles"
```

---

### Task 0.3: 搭建 Supabase 客户端和 Auth 中间件

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`

- [ ] **Step 1: 创建浏览器端 Supabase 客户端**

创建 `/Users/yu/pet-ecosystem/src/lib/supabase/client.ts`：

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: 创建 Auth 中间件**

创建 `/Users/yu/pet-ecosystem/src/lib/supabase/middleware.ts`：

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 受保护页面列表
  const protectedPaths = ['/messages', '/profile', '/pets', '/orders']
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  )

  // 未登录访问受保护页面 → 跳转登录
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

- [ ] **Step 3: 创建 middleware.ts 在项目根目录**

创建 `/Users/yu/pet-ecosystem/src/middleware.ts`：

```typescript
import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 4: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add Supabase client and auth middleware"
```

---

## Phase 1: 数据库 & 认证

### Task 1.1: 创建数据库迁移文件

**Files:**
- Create: `supabase/migrations/00001_initial_schema.sql`

- [ ] **Step 1: 编写完整建表 SQL**

创建 `/Users/yu/pet-ecosystem/supabase/migrations/00001_initial_schema.sql`：

```sql
-- ==========================================
-- 商丘宠物生态平台 — 初始数据库 Schema
-- ==========================================

-- 1. 用户扩展资料表 (关联 Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_subscribed BOOLEAN DEFAULT FALSE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. 宠物档案表
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT CHECK (species IN ('dog', 'cat', 'other')) DEFAULT 'dog',
  breed TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  weight DOUBLE PRECISION,
  avatar_url TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  vaccine_records JSONB DEFAULT '[]'::jsonb,
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 店铺/医院表
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('pet_shop', 'pet_hospital', 'grooming')) NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone TEXT,
  business_hours TEXT,
  rating DOUBLE PRECISION DEFAULT 0,
  cover_image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 店铺商品/服务表
CREATE TABLE shop_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('food', 'supplies', 'medicine', 'service')) NOT NULL,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  image TEXT,
  delivery_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 追踪项圈表
CREATE TABLE tracking_collars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  device_serial TEXT UNIQUE NOT NULL,
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  last_ping_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GPS 轨迹记录表
CREATE TABLE tracking_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collar_id UUID REFERENCES tracking_collars(id) ON DELETE CASCADE NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 按 collar_id + 时间查询的索引
CREATE INDEX idx_tracking_records_collar_time
  ON tracking_records (collar_id, recorded_at DESC);

-- 7. 会话表
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- 8. 消息表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 按会话+时间排序查询
CREATE INDEX idx_messages_conversation_time
  ON messages (conversation_id, created_at);

-- 9. 订单表
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'delivering', 'done')) DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RLS (Row Level Security) 策略
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_collars ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- profiles: 用户可读所有，只能改自己的
CREATE POLICY "profiles_read_all" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- pets: 主人可读写自己的宠物，其他人可读
CREATE POLICY "pets_read_all" ON pets
  FOR SELECT USING (true);
CREATE POLICY "pets_insert_own" ON pets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "pets_update_own" ON pets
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "pets_delete_own" ON pets
  FOR DELETE USING (auth.uid() = owner_id);

-- shops: 所有人可读
CREATE POLICY "shops_read_all" ON shops
  FOR SELECT USING (true);

-- shop_products: 所有人可读
CREATE POLICY "shop_products_read_all" ON shop_products
  FOR SELECT USING (true);

-- tracking_collars: 主人读写
CREATE POLICY "collars_own" ON tracking_collars
  FOR ALL USING (auth.uid() = owner_id);

-- tracking_records: 主人可读自己项圈的记录
CREATE POLICY "records_own" ON tracking_records
  FOR SELECT USING (
    collar_id IN (
      SELECT id FROM tracking_collars WHERE owner_id = auth.uid()
    )
  );
CREATE POLICY "records_insert_own" ON tracking_records
  FOR INSERT WITH CHECK (
    collar_id IN (
      SELECT id FROM tracking_collars WHERE owner_id = auth.uid()
    )
  );

-- conversations: 参与者可读
CREATE POLICY "conversations_participant" ON conversations
  FOR SELECT USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );
CREATE POLICY "conversations_insert" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

-- messages: 会话参与者可读写
CREATE POLICY "messages_participant" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = participant_1 OR auth.uid() = participant_2
    )
  );
CREATE POLICY "messages_insert_own" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- orders: 买家可读自己的，店铺可读关联的
CREATE POLICY "orders_buyer" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "orders_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ==========================================
-- Realtime 订阅启用
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
```

- [ ] **Step 2: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add database schema with RLS policies and realtime"
```

---

### Task 1.2: 创建数据库查询辅助函数

**Files:**
- Create: `src/lib/db/profiles.ts`, `src/lib/db/pets.ts`, `src/lib/db/shops.ts`, `src/lib/db/messages.ts`, `src/lib/db/tracking.ts`, `src/lib/db/orders.ts`

- [ ] **Step 1: profiles.ts**

创建 `/Users/yu/pet-ecosystem/src/lib/db/profiles.ts`：

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'nickname' | 'avatar_url' | 'phone' | 'lat' | 'lng'>>
): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) return null
  return data as Profile
}

export async function subscribeUser(userId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ is_subscribed: true })
    .eq('id', userId)
  return !error
}

export async function getOnlinePets(): Promise<Profile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
  if (error) return []
  return data as Profile[]
}
```

- [ ] **Step 2: pets.ts**

创建 `/Users/yu/pet-ecosystem/src/lib/db/pets.ts`：

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Pet } from '@/types'

export async function getMyPets(userId: string): Promise<Pet[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as Pet[]
}

export async function getPet(petId: string): Promise<Pet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single()
  if (error) return null
  return data as Pet
}

export async function createPet(
  pet: Omit<Pet, 'id' | 'created_at'>
): Promise<Pet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .insert(pet)
    .select()
    .single()
  if (error) return null
  return data as Pet
}

export async function updatePet(
  petId: string,
  updates: Partial<Omit<Pet, 'id' | 'owner_id' | 'created_at'>>
): Promise<Pet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', petId)
    .select()
    .single()
  if (error) return null
  return data as Pet
}

export async function deletePet(petId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId)
  return !error
}
```

- [ ] **Step 3: shops.ts**

创建 `/Users/yu/pet-ecosystem/src/lib/db/shops.ts`：

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Shop, ShopProduct, ShopFilter } from '@/types'

export async function getShops(
  filter: ShopFilter = 'all'
): Promise<Shop[]> {
  const supabase = createClient()
  let query = supabase.from('shops').select('*')

  if (filter !== 'all') {
    query = query.eq('type', filter)
  }

  const { data, error } = await query.order('rating', { ascending: false })
  if (error) return []
  return data as Shop[]
}

export async function getShop(shopId: string): Promise<Shop | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single()
  if (error) return null
  return data as Shop
}

export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('shop_id', shopId)
  if (error) return []
  return data as ShopProduct[]
}

export async function searchShops(keyword: string): Promise<Shop[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .ilike('name', `%${keyword}%`)
  if (error) return []
  return data as Shop[]
}
```

- [ ] **Step 4: messages.ts**

创建 `/Users/yu/pet-ecosystem/src/lib/db/messages.ts`：

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Conversation, Message } from '@/types'

export async function getConversations(
  userId: string
): Promise<(Conversation & { other_user: { id: string; nickname: string; avatar_url: string } | null })[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false })

  if (error || !data) return []

  // 获取每个会话的对方用户信息
  const enriched = await Promise.all(
    data.map(async (conv) => {
      const otherId =
        conv.participant_1 === userId
          ? conv.participant_2
          : conv.participant_1
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_url')
        .eq('id', otherId)
        .single()
      return { ...conv, other_user: profile }
    })
  )

  return enriched
}

export async function getOrCreateConversation(
  user1Id: string,
  user2Id: string
): Promise<string | null> {
  const supabase = createClient()
  // 确保 user1 < user2 以利用 UNIQUE 约束
  const [p1, p2] = [user1Id, user2Id].sort()

  // 先查现有
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1', p1)
    .eq('participant_2', p2)
    .single()

  if (existing) return existing.id

  // 创建新会话
  const { data: created } = await supabase
    .from('conversations')
    .insert({ participant_1: p1, participant_2: p2 })
    .select('id')
    .single()

  return created?.id || null
}

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data as Message[]
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  imageUrl?: string
): Promise<Message | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      image_url: imageUrl || null,
    })
    .select()
    .single()

  if (error) return null

  // 更新会话最后消息时间
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data as Message
}

export function subscribeMessages(
  conversationId: string,
  onMessage: (message: Message) => void
) {
  const supabase = createClient()
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe()
}
```

- [ ] **Step 5: tracking.ts**

创建 `/Users/yu/pet-ecosystem/src/lib/db/tracking.ts`：

```typescript
import { createClient } from '@/lib/supabase/client'
import type { TrackingCollar, TrackingRecord } from '@/types'

export async function getCollarForPet(
  petId: string
): Promise<TrackingCollar | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_collars')
    .select('*')
    .eq('pet_id', petId)
    .single()
  if (error) return null
  return data as TrackingCollar
}

export async function getTrackingRecords(
  collarId: string,
  limit: number = 100
): Promise<TrackingRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_records')
    .select('*')
    .eq('collar_id', collarId)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data as TrackingRecord[]).reverse()
}

export async function addTrackingRecord(
  collarId: string,
  lat: number,
  lng: number
): Promise<TrackingRecord | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_records')
    .insert({ collar_id: collarId, lat, lng })
    .select()
    .single()
  if (error) return null

  // 更新项圈最后心跳时间和电量
  await supabase
    .from('tracking_collars')
    .update({
      last_ping_at: new Date().toISOString(),
      battery_level: 85, // 模拟值
    })
    .eq('id', collarId)

  return data as TrackingRecord
}

export async function createCollar(
  ownerId: string,
  petId: string,
  deviceSerial: string
): Promise<TrackingCollar | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_collars')
    .insert({
      owner_id: ownerId,
      pet_id: petId,
      device_serial: deviceSerial,
    })
    .select()
    .single()
  if (error) return null
  return data as TrackingCollar
}
```

- [ ] **Step 6: orders.ts**

创建 `/Users/yu/pet-ecosystem/src/lib/db/orders.ts`：

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/types'

export async function getMyOrders(userId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as Order[]
}

export async function createOrder(
  buyerId: string,
  shopId: string,
  items: OrderItem[],
  totalAmount: number,
  deliveryAddress: string
): Promise<Order | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert({
      buyer_id: buyerId,
      shop_id: shopId,
      items: items as any,
      total_amount: totalAmount,
      delivery_address: deliveryAddress,
      status: 'pending',
    })
    .select()
    .single()
  if (error) return null
  return data as Order
}
```

- [ ] **Step 7: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add all database query helper functions"
```

---

### Task 1.3: 创建登录页面和 Auth 回调

**Files:**
- Create: `src/app/auth/login/page.tsx`, `src/app/auth/callback/route.ts`
- Create: `src/lib/hooks/useAuth.ts`

- [ ] **Step 1: 登录页面**

创建 `/Users/yu/pet-ecosystem/src/app/auth/login/page.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const sendCode = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      phone: '+86' + phone,
    })
    if (error) {
      setError('发送验证码失败: ' + error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  const verifyCode = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      phone: '+86' + phone,
      token: code,
      type: 'sms',
    })
    if (error) {
      setError('验证失败: ' + error.message)
    } else {
      router.push('/map')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-primary-50 to-white">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-gray-900">宠物生态平台</h1>
        <p className="text-gray-500 mt-2">商丘 · 宠物生活新方式</p>
      </div>

      {/* 登录表单 */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-primary-400">
            <span className="text-gray-500 mr-2">+86</span>
            <input
              type="tel"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="请输入手机号"
              className="flex-1 outline-none text-gray-900"
            />
          </div>
        </div>

        {sent && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              验证码
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="请输入6位验证码"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={sent ? verifyCode : sendCode}
          disabled={loading || phone.length !== 11}
          className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium
            disabled:bg-gray-300 disabled:cursor-not-allowed
            active:scale-[0.98] transition-all"
        >
          {loading ? '处理中...' : sent ? '验证并登录' : '获取验证码'}
        </button>

        {sent && (
          <button
            onClick={() => { setSent(false); setCode('') }}
            className="w-full text-gray-500 text-sm mt-3 py-2"
          >
            更换手机号
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-8">
        登录即表示同意《用户协议》和《隐私政策》
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Auth 回调处理**

创建 `/Users/yu/pet-ecosystem/src/app/auth/callback/route.ts`：

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/map'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(origin + next)
}
```

- [ ] **Step 3: useAuth Hook**

创建 `/Users/yu/pet-ecosystem/src/lib/hooks/useAuth.ts`：

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { getProfile } from '@/lib/db/profiles'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const p = await getProfile(user.id)
        setProfile(p)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const p = await getProfile(session.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return { user, profile, loading, signOut }
}
```

- [ ] **Step 4: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add login page, auth callback, and useAuth hook"
```

---

## Phase 2: 核心 UI 框架

### Task 2.1: 创建通用 UI 组件

**Files:**
- Create: `src/components/ui/Button.tsx`, `Input.tsx`, `Modal.tsx`, `Avatar.tsx`, `Loading.tsx`

- [ ] **Step 1: Button.tsx**

创建 `/Users/yu/pet-ecosystem/src/components/ui/Button.tsx`：

```tsx
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-500 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Input.tsx**

创建 `/Users/yu/pet-ecosystem/src/components/ui/Input.tsx`：

```tsx
import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border rounded-lg px-3 py-2.5 text-gray-900 outline-none
          focus:ring-2 focus:ring-primary-400 transition-all
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Modal.tsx**

创建 `/Users/yu/pet-ecosystem/src/components/ui/Modal.tsx`：

```tsx
'use client'

import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto p-5 animate-slide-up">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 text-xl">&times;</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Avatar.tsx**

创建 `/Users/yu/pet-ecosystem/src/components/ui/Avatar.tsx`：

```tsx
interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }

  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  const initials = name?.slice(0, 2) || '🐾'

  return (
    <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium`}>
      {initials}
    </div>
  )
}
```

- [ ] **Step 5: Loading.tsx**

创建 `/Users/yu/pet-ecosystem/src/components/ui/Loading.tsx`：

```tsx
export default function Loading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm mt-3">{text}</p>
    </div>
  )
}
```

- [ ] **Step 6: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add reusable UI components (Button, Input, Modal, Avatar, Loading)"
```

---

### Task 2.2: 创建底部导航栏和页面壳

**Files:**
- Create: `src/components/layout/TabBar.tsx`
- Create: `src/app/layout.tsx` (更新)
- Create: `src/app/page.tsx`
- Create: `src/app/map/page.tsx`, `src/app/discover/page.tsx`, `src/app/messages/page.tsx`, `src/app/profile/page.tsx`

- [ ] **Step 1: TabBar 组件**

创建 `/Users/yu/pet-ecosystem/src/components/layout/TabBar.tsx`：

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { path: '/map', label: '地图', icon: '📍' },
  { path: '/discover', label: '发现', icon: '🔍' },
  { path: '/messages', label: '消息', icon: '💬' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.path)
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: 更新根布局**

修改 `/Users/yu/pet-ecosystem/src/app/layout.tsx`：

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '宠物生态平台 · 商丘',
  description: '商丘宠物生活新方式 — 地图找店、宠物档案、追踪定位、宠友社交',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="min-h-screen max-w-[480px] mx-auto relative bg-white">
          {children}
        </main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: 首页重定向**

创建 `/Users/yu/pet-ecosystem/src/app/page.tsx`：

```tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/map')
}
```

- [ ] **Step 4: 地图页面壳**

创建 `/Users/yu/pet-ecosystem/src/app/map/page.tsx`：

```tsx
import TabBar from '@/components/layout/TabBar'

export default function MapPage() {
  return (
    <>
      <div className="map-container bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">地图加载中...</p>
      </div>
      <TabBar />
    </>
  )
}
```

- [ ] **Step 5: 发现页面壳**

创建 `/Users/yu/pet-ecosystem/src/app/discover/page.tsx`：

```tsx
import TabBar from '@/components/layout/TabBar'

export default function DiscoverPage() {
  return (
    <>
      <div className="pb-14 p-4">
        <h1 className="text-xl font-bold mb-4">🔍 发现</h1>
        <p className="text-gray-400">店铺列表加载中...</p>
      </div>
      <TabBar />
    </>
  )
}
```

- [ ] **Step 6: 消息页面壳**

创建 `/Users/yu/pet-ecosystem/src/app/messages/page.tsx`：

```tsx
import TabBar from '@/components/layout/TabBar'

export default function MessagesPage() {
  return (
    <>
      <div className="pb-14 p-4">
        <h1 className="text-xl font-bold mb-4">💬 消息</h1>
        <p className="text-gray-400">暂无消息</p>
      </div>
      <TabBar />
    </>
  )
}
```

- [ ] **Step 7: 个人中心页面壳**

创建 `/Users/yu/pet-ecosystem/src/app/profile/page.tsx`：

```tsx
import TabBar from '@/components/layout/TabBar'

export default function ProfilePage() {
  return (
    <>
      <div className="pb-14 p-4">
        <h1 className="text-xl font-bold mb-4">👤 我的</h1>
        <p className="text-gray-400">请先登录</p>
      </div>
      <TabBar />
    </>
  )
}
```

- [ ] **Step 8: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add TabBar navigation and page shells for all 4 tabs"
```

---

## Phase 3: 地图功能

### Task 3.1: 集成高德地图，实现地图容器和标记

**Files:**
- Create: `src/components/map/PetMap.tsx`, `src/components/map/MapSearch.tsx`, `src/components/map/MarkerFilter.tsx`
- Modify: `src/app/map/page.tsx`
- Create: `src/lib/hooks/useShops.ts`

- [ ] **Step 1: 高德地图脚本加载器 Hook**

创建 `/Users/yu/pet-ecosystem/src/lib/hooks/useAMap.ts`：

```typescript
'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}

let loadPromise: Promise<void> | null = null

function loadAMapScript(key: string, version: string): Promise<void> {
  if (loadPromise) return loadPromise
  if (window.AMap) {
    loadPromise = Promise.resolve()
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    window._AMapSecurityConfig = {
      securityJsCode: '', // 可选: 高德安全密钥
    }
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=${version}&key=${key}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('高德地图加载失败'))
    document.head.appendChild(script)
  })

  return loadPromise
}

export function useAMap() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_AMAP_KEY
    const version = process.env.NEXT_PUBLIC_AMAP_VERSION || '2.0'

    if (!key) {
      setError('未配置高德地图 API Key')
      return
    }

    loadAMapScript(key, version)
      .then(() => setLoaded(true))
      .catch((e) => setError(e.message))
  }, [])

  return { loaded, error }
}
```

- [ ] **Step 2: PetMap 地图容器组件**

创建 `/Users/yu/pet-ecosystem/src/components/map/PetMap.tsx`：

```tsx
'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useAMap } from '@/lib/hooks/useAMap'
import { getShops } from '@/lib/db/shops'
import { getOnlinePets } from '@/lib/db/profiles'
import type { Shop, Profile, MarkerType } from '@/types'
import { useRouter } from 'next/navigation'

interface PetMapProps {
  onMarkerClick?: (type: MarkerType, id: string) => void
  filter?: string
}

// 商丘市中心坐标
const SHANGQIU_CENTER: [number, number] = [115.656, 34.414]

export default function PetMap({ onMarkerClick, filter = 'all' }: PetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const { loaded, error: mapError } = useAMap()
  const [shops, setShops] = useState<Shop[]>([])
  const [onlinePets, setOnlinePets] = useState<Profile[]>([])
  const router = useRouter()

  // 加载数据
  useEffect(() => {
    getShops().then(setShops)
    getOnlinePets().then(setOnlinePets)
  }, [])

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current) return

    const AMap = window.AMap
    mapInstance.current = new AMap.Map(mapRef.current, {
      zoom: 13,
      center: SHANGQIU_CENTER,
      mapStyle: 'amap://styles/light',
    })

    // 添加定位控件
    mapInstance.current.plugin('AMap.Geolocation', function () {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        buttonPosition: 'RB',
        buttonOffset: [10, 70],
        zoomToAccuracy: true,
      })
      mapInstance.current.addControl(geolocation)
    })

    return () => {
      mapInstance.current?.destroy()
    }
  }, [loaded])

  // 清除旧标记
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => {
      m.setMap(null)
    })
    markersRef.current = []
  }, [])

  // 创建自定义标记图标
  const createMarkerIcon = useCallback((type: MarkerType): string => {
    const colors: Record<MarkerType, string> = {
      hospital: '#F44336',
      shop: '#2196F3',
      pet: '#4CAF50',
    }
    const emoji: Record<MarkerType, string> = {
      hospital: '🏥',
      shop: '🏪',
      pet: '🐾',
    }
    const color = colors[type]
    // 用 SVG data URL 做标记
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        <circle cx="18" cy="16" r="14" fill="${color}" opacity="0.9"/>
        <text x="18" y="21" text-anchor="middle" font-size="16">${emoji[type]}</text>
        <polygon points="18,40 8,26 28,26" fill="${color}" opacity="0.9"/>
      </svg>
    `)}`
  }, [])

  // 渲染标记
  useEffect(() => {
    if (!mapInstance.current || !loaded) return
    const AMap = window.AMap

    clearMarkers()

    // 店铺标记
    shops.forEach((shop) => {
      if (filter !== 'all' && shop.type !== filter) return
      const type: MarkerType = shop.type === 'pet_hospital' ? 'hospital' : 'shop'
      const marker = new AMap.Marker({
        position: [shop.lng, shop.lat],
        icon: createMarkerIcon(type),
        offset: [0, -22],
        zIndex: 100,
      })
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(type, shop.id)
        } else {
          router.push(`/shops/${shop.id}`)
        }
      })
      marker.setMap(mapInstance.current)
      markersRef.current.push(marker)
    })

    // 在线宠物标记
    if (filter === 'all') {
      onlinePets.forEach((profile) => {
        if (!profile.lat || !profile.lng) return
        const marker = new AMap.Marker({
          position: [profile.lng, profile.lat],
          icon: createMarkerIcon('pet'),
          offset: [0, -22],
          zIndex: 80,
        })
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick('pet', profile.id)
          }
        })
        marker.setMap(mapInstance.current)
        markersRef.current.push(marker)
      })
    }
  }, [shops, onlinePets, filter, loaded, clearMarkers, createMarkerIcon, onMarkerClick, router])

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{mapError}</p>
      </div>
    )
  }

  return (
    <div ref={mapRef} className="w-full h-full" />
  )
}
```

- [ ] **Step 3: MapSearch 搜索栏**

创建 `/Users/yu/pet-ecosystem/src/components/map/MapSearch.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchShops } from '@/lib/db/shops'
import type { Shop } from '@/types'

export default function MapSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Shop[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.length >= 1) {
      const shops = await searchShops(value)
      setResults(shops)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  return (
    <div className="absolute top-3 left-3 right-3 z-10">
      <div className="bg-white rounded-xl shadow-lg flex items-center px-4 py-2.5">
        <span className="text-gray-400 mr-2">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索宠物店、医院..."
          className="flex-1 outline-none text-sm text-gray-900"
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto">
          {results.map((shop) => (
            <button
              key={shop.id}
              onClick={() => router.push(`/shops/${shop.id}`)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <p className="font-medium text-sm">{shop.name}</p>
              <p className="text-xs text-gray-400">{shop.address}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: MarkerFilter 筛选器**

创建 `/Users/yu/pet-ecosystem/src/components/map/MarkerFilter.tsx`：

```tsx
'use client'

import type { ShopFilter } from '@/types'

const filters: { value: ShopFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pet_shop', label: '🏪 宠物店' },
  { value: 'pet_hospital', label: '🏥 医院' },
  { value: 'grooming', label: '✂️ 美容' },
]

interface MarkerFilterProps {
  current: ShopFilter
  onChange: (filter: ShopFilter) => void
}

export default function MarkerFilter({ current, onChange }: MarkerFilterProps) {
  return (
    <div className="absolute bottom-20 left-3 right-3 z-10">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${current === f.value
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white text-gray-600 shadow'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 更新地图页面**

修改 `/Users/yu/pet-ecosystem/src/app/map/page.tsx`：

```tsx
'use client'

import { useState } from 'react'
import TabBar from '@/components/layout/TabBar'
import PetMap from '@/components/map/PetMap'
import MapSearch from '@/components/map/MapSearch'
import MarkerFilter from '@/components/map/MarkerFilter'
import type { ShopFilter, MarkerType } from '@/types'

export default function MapPage() {
  const [filter, setFilter] = useState<ShopFilter>('all')

  const handleMarkerClick = (type: MarkerType, id: string) => {
    // 点击标记时跳转
    if (type === 'pet') {
      // TODO: 显示宠物信息弹窗
      console.log('Pet clicked:', id)
    }
  }

  return (
    <>
      <div className="relative map-container">
        <PetMap onMarkerClick={handleMarkerClick} filter={filter} />
        <MapSearch />
        <MarkerFilter current={filter} onChange={setFilter} />
      </div>
      <TabBar />
    </>
  )
}
```

- [ ] **Step 6: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: integrate AMap with custom markers, search, and filter"
```

---

## Phase 4: 店铺系统

### Task 4.1: 店铺详情页

**Files:**
- Create: `src/app/shops/[id]/page.tsx`
- Create: `src/components/shop/ShopCard.tsx`, `src/components/shop/ProductCard.tsx`

- [ ] **Step 1: ShopCard 组件**

创建 `/Users/yu/pet-ecosystem/src/components/shop/ShopCard.tsx`：

```tsx
import Link from 'next/link'
import type { Shop } from '@/types'

const typeLabels: Record<string, string> = {
  pet_shop: '宠物店',
  pet_hospital: '宠物医院',
  grooming: '美容洗护',
}

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shops/${shop.id}`} className="block">
      <div className="shop-card flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-3xl">
          {shop.type === 'pet_hospital' ? '🏥' : shop.type === 'grooming' ? '✂️' : '🏪'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {typeLabels[shop.type]}
            {shop.rating > 0 && <span className="ml-2">⭐ {shop.rating.toFixed(1)}</span>}
          </p>
          <p className="text-sm text-gray-500 mt-1 truncate">{shop.address}</p>
          {shop.business_hours && (
            <p className="text-xs text-gray-400 mt-0.5">🕐 {shop.business_hours}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: ProductCard 组件**

创建 `/Users/yu/pet-ecosystem/src/components/shop/ProductCard.tsx`：

```tsx
import type { ShopProduct } from '@/types'

interface ProductCardProps {
  product: ShopProduct
  onBuy?: (product: ShopProduct) => void
}

const categoryLabels: Record<string, string> = {
  food: '食品',
  supplies: '用品',
  medicine: '药品',
  service: '服务',
}

export default function ProductCard({ product, onBuy }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl">
        {product.category === 'food' ? '🦴' :
         product.category === 'medicine' ? '💊' :
         product.category === 'service' ? '🛁' : '🎾'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
            <span className="text-xs text-gray-400">{categoryLabels[product.category]}</span>
          </div>
          <span className="text-primary-500 font-bold text-lg">¥{product.price}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          {product.delivery_available && (
            <span className="text-xs text-green-500">🚚 支持配送</span>
          )}
          {onBuy && (
            <button
              onClick={() => onBuy(product)}
              className="bg-primary-500 text-white text-xs px-4 py-1.5 rounded-full font-medium"
            >
              购买
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 店铺详情页**

创建 `/Users/yu/pet-ecosystem/src/app/shops/[id]/page.tsx`：

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getShop, getShopProducts } from '@/lib/db/shops'
import { getOrCreateConversation } from '@/lib/db/messages'
import { createOrder } from '@/lib/db/orders'
import { useAuth } from '@/lib/hooks/useAuth'
import ProductCard from '@/components/shop/ProductCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import type { Shop, ShopProduct } from '@/types'

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const [s, p] = await Promise.all([getShop(id), getShopProducts(id)])
      setShop(s)
      setProducts(p)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <Loading />
  if (!shop) return <div className="p-8 text-center text-gray-400">店铺不存在</div>

  const handleBuy = (product: ShopProduct) => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    setSelectedProduct(product)
    setDeliveryAddress('')
    setOrderSuccess(false)
  }

  const handleConfirmOrder = async () => {
    if (!selectedProduct || !user || !deliveryAddress.trim()) return

    await createOrder(
      user.id,
      shop!.id,
      [{ product_id: selectedProduct.id, product_name: selectedProduct.name, quantity: 1, price: selectedProduct.price }],
      selectedProduct.price,
      deliveryAddress
    )

    setOrderSuccess(true)
    setTimeout(() => {
      setSelectedProduct(null)
      setOrderSuccess(false)
    }, 2000)
  }

  const handleChat = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    // 创建一个虚拟"店铺客服"用户的会话
    // 实际场景中，shop表需要关联owner_id
    router.push('/messages')
  }

  const handleNavigate = () => {
    window.open(
      `https://uri.amap.com/navigation?to=${shop.lng},${shop.lat},${encodeURIComponent(shop.name)}`,
      '_blank'
    )
  }

  return (
    <div className="pb-6">
      {/* 头图 */}
      <div className="h-48 bg-gradient-to-b from-primary-100 to-primary-50 flex items-center justify-center text-6xl">
        {shop.type === 'pet_hospital' ? '🏥' : shop.type === 'grooming' ? '✂️' : '🏪'}
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 shadow"
      >
        ←
      </button>

      {/* 店铺信息 */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h1 className="text-xl font-bold">{shop.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {shop.type === 'pet_hospital' ? '宠物医院' : shop.type === 'grooming' ? '美容洗护' : '宠物店'}
            {shop.rating > 0 && <span className="ml-2">⭐ {shop.rating.toFixed(1)}</span>}
          </p>
          <p className="text-gray-500 text-sm mt-1">📍 {shop.address}</p>
          {shop.business_hours && (
            <p className="text-gray-500 text-sm">🕐 {shop.business_hours}</p>
          )}
          {shop.phone && (
            <p className="text-gray-500 text-sm">📞 {shop.phone}</p>
          )}
          {shop.description && (
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{shop.description}</p>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleNavigate}>
              🧭 导航
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={handleChat}>
              💬 咨询
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={() => {}}>
              📞 电话
            </Button>
          </div>
        </div>

        {/* 商品/服务列表 */}
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-3">
            {shop.type === 'pet_hospital' ? '🩺 医疗服务' :
             shop.type === 'grooming' ? '✂️ 美容服务' : '🛍️ 商品与服务'}
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无商品</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onBuy={handleBuy} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 购买弹窗 */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={orderSuccess ? '✅ 下单成功' : '确认订单'}
      >
        {orderSuccess ? (
          <div className="text-center py-4">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-gray-600">订单已提交，店铺将尽快处理</p>
            <p className="text-gray-400 text-sm mt-1">当前为货到付款</p>
          </div>
        ) : selectedProduct && (
          <>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="text-primary-500 font-bold text-lg">¥{selectedProduct.price}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                配送地址
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="请输入收货地址"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <Button
              variant="primary"
              className="w-full"
              disabled={!deliveryAddress.trim()}
              onClick={handleConfirmOrder}
            >
              确认下单（货到付款）
            </Button>
          </>
        )}
      </Modal>
    </div>
  )
}
```

- [ ] **Step 4: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add shop detail page with products, order flow, and navigation"
```

---

### Task 4.2: 完善发现页面

**Files:**
- Modify: `src/app/discover/page.tsx`

- [ ] **Step 1: 发现页面完整实现**

修改 `/Users/yu/pet-ecosystem/src/app/discover/page.tsx`：

```tsx
'use client'

import { useState, useEffect } from 'react'
import TabBar from '@/components/layout/TabBar'
import ShopCard from '@/components/shop/ShopCard'
import Loading from '@/components/ui/Loading'
import { getShops } from '@/lib/db/shops'
import type { Shop, ShopFilter } from '@/types'

const categories: { value: ShopFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pet_shop', label: '宠物店' },
  { value: 'pet_hospital', label: '宠物医院' },
  { value: 'grooming', label: '美容洗护' },
]

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('all')
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getShops(activeFilter).then((data) => {
      setShops(data)
      setLoading(false)
    })
  }, [activeFilter])

  return (
    <>
      <div className="pb-14">
        {/* 顶部 */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold mb-3">🔍 发现</h1>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${activeFilter === cat.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 列表 */}
        <div className="px-4 space-y-3">
          {loading ? (
            <Loading />
          ) : shops.length === 0 ? (
            <p className="text-gray-400 text-center py-20">暂无店铺数据</p>
          ) : (
            shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
          )}
        </div>
      </div>
      <TabBar />
    </>
  )
}
```

- [ ] **Step 2: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: complete discover page with category filters and shop listing"
```

---

## Phase 5: 宠物档案

### Task 5.1: 宠物档案创建/编辑/查看

**Files:**
- Create: `src/components/pet/PetCard.tsx`, `src/components/pet/PetForm.tsx`
- Create: `src/app/pets/new/page.tsx`, `src/app/pets/[id]/page.tsx`, `src/app/pets/[id]/edit/page.tsx`
- Create: `src/lib/hooks/usePets.ts`

- [ ] **Step 1: usePets Hook**

创建 `/Users/yu/pet-ecosystem/src/lib/hooks/usePets.ts`：

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMyPets, getPet, createPet, updatePet, deletePet } from '@/lib/db/pets'
import type { Pet } from '@/types'

export function usePets(userId: string | undefined) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) { setPets([]); setLoading(false); return }
    setLoading(true)
    const data = await getMyPets(userId)
    setPets(data)
    setLoading(false)
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { pets, loading, refresh, createPet, updatePet, deletePet }
}
```

- [ ] **Step 2: PetForm 表单组件**

创建 `/Users/yu/pet-ecosystem/src/components/pet/PetForm.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { createPet, updatePet } from '@/lib/db/pets'
import type { Pet } from '@/types'

interface PetFormProps {
  userId: string
  pet?: Pet | null  // null = 创建模式
}

export default function PetForm({ userId, pet }: PetFormProps) {
  const router = useRouter()
  const isEdit = !!pet
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: pet?.name || '',
    species: pet?.species || 'dog',
    breed: pet?.breed || '',
    age: pet?.age || null as number | null,
    gender: pet?.gender || null as 'male' | 'female' | null,
    weight: pet?.weight || null as number | null,
    allergies: pet?.allergies || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('请输入宠物名字')
      return
    }
    setSaving(true)
    setError('')

    const petData = {
      owner_id: userId,
      name: form.name.trim(),
      species: form.species as 'dog' | 'cat' | 'other',
      breed: form.breed || null,
      age: form.age,
      gender: form.gender,
      weight: form.weight,
      allergies: form.allergies || null,
      avatar_url: null,
      photos: [],
      vaccine_records: [],
    }

    if (isEdit && pet) {
      const result = await updatePet(pet.id, petData)
      if (result) router.push(`/pets/${pet.id}`)
      else setError('保存失败')
    } else {
      const result = await createPet(petData)
      if (result) router.push(`/pets/${result.id}`)
      else setError('创建失败')
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <Input
        label="宠物名字 *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="给TA取个名字吧"
        error={error}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">种类</label>
        <div className="flex gap-3">
          {[
            { value: 'dog', label: '🐶 狗狗', emoji: '🐶' },
            { value: 'cat', label: '🐱 猫猫', emoji: '🐱' },
            { value: 'other', label: '🐹 其他', emoji: '🐹' },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setForm({ ...form, species: s.value })}
              className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-all
                ${form.species === s.value
                  ? 'bg-primary-100 text-primary-600 border-2 border-primary-400'
                  : 'bg-gray-50 text-gray-500 border-2 border-transparent'
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="品种"
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
          placeholder={form.species === 'dog' ? '如：金毛' : form.species === 'cat' ? '如：英短' : ''}
        />
        <Input
          label="年龄（月）"
          type="number"
          value={form.age ?? ''}
          onChange={(e) => setForm({ ...form, age: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="如：12"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <div className="flex gap-2">
            {[
              { value: 'male', label: '♂ 公' },
              { value: 'female', label: '♀ 母' },
            ].map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setForm({ ...form, gender: g.value as any })}
                className={`flex-1 py-2 rounded-lg text-sm transition-all
                  ${form.gender === g.value
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-400'
                    : 'bg-gray-50 text-gray-500 border-2 border-transparent'
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <Input
          label="体重（kg）"
          type="number"
          value={form.weight ?? ''}
          onChange={(e) => setForm({ ...form, weight: e.target.value ? parseFloat(e.target.value) : null })}
          placeholder="如：5.5"
        />
      </div>

      <Input
        label="过敏信息"
        value={form.allergies}
        onChange={(e) => setForm({ ...form, allergies: e.target.value })}
        placeholder="如：鸡肉过敏（选填）"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-4"
        disabled={saving}
      >
        {saving ? '保存中...' : isEdit ? '保存修改' : '🐾 创建宠物档案'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: 创建宠物页面**

创建 `/Users/yu/pet-ecosystem/src/app/pets/new/page.tsx`：

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import PetForm from '@/components/pet/PetForm'
import Loading from '@/components/ui/Loading'

export default function NewPetPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">添加宠物</h1>
      </div>
      <PetForm userId={user.id} />
    </div>
  )
}
```

- [ ] **Step 4: 宠物详情页**

创建 `/Users/yu/pet-ecosystem/src/app/pets/[id]/page.tsx`：

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPet, getCollarForPet } from '@/lib/db/tracking'
import { useAuth } from '@/lib/hooks/useAuth'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import type { Pet, TrackingCollar } from '@/types'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [collar, setCollar] = useState<TrackingCollar | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, c] = await Promise.all([getPet(id), getCollarForPet(id)])
      setPet(p)
      setCollar(c)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <Loading />
  if (!pet) return <p className="text-center py-20 text-gray-400">宠物不存在</p>

  const isOwner = user?.id === pet.owner_id

  return (
    <div className="pb-20">
      {/* 头图 */}
      <div className="h-56 bg-gradient-to-b from-primary-100 to-primary-50 flex flex-col items-center justify-center relative">
        <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow">←</button>
        {isOwner && (
          <button
            onClick={() => router.push(`/pets/${pet.id}/edit`)}
            className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm shadow"
          >
            编辑
          </button>
        )}
        <div className="text-7xl mb-2">
          {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐹'}
        </div>
        <h1 className="text-2xl font-bold">{pet.name}</h1>
        <p className="text-gray-500 text-sm">
          {pet.breed} · {pet.gender === 'male' ? '♂' : pet.gender === 'female' ? '♀' : ''} · {pet.age}个月
        </p>
      </div>

      {/* 基本信息 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">体重</p>
              <p className="font-bold text-gray-900">{pet.weight ? `${pet.weight}kg` : '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">年龄</p>
              <p className="font-bold text-gray-900">{pet.age ? `${pet.age}个月` : '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">性别</p>
              <p className="font-bold text-gray-900">{pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '-'}</p>
            </div>
          </div>

          {/* 追踪状态 */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">📍 GPS项圈</p>
              <p className="text-xs text-blue-600">
                {collar
                  ? `在线 · 电量 ${collar.battery_level}% · ${collar.last_ping_at ? new Date(collar.last_ping_at).toLocaleTimeString() : '-'}`
                  : '未绑定项圈'}
              </p>
            </div>
            {collar && (
              <Button size="sm" onClick={() => router.push('/pets/tracking')}>
                实时追踪
              </Button>
            )}
          </div>

          {/* 疫苗记录 */}
          {pet.vaccine_records && pet.vaccine_records.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💉 疫苗记录</h3>
              {pet.vaccine_records.map((v: any, i: number) => (
                <div key={i} className="text-sm text-gray-600 flex justify-between py-1">
                  <span>{v.name}</span>
                  <span>{v.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* 过敏 */}
          {pet.allergies && (
            <div>
              <h3 className="font-semibold text-gray-900">⚠️ 过敏</h3>
              <p className="text-sm text-red-500">{pet.allergies}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 编辑宠物页面**

创建 `/Users/yu/pet-ecosystem/src/app/pets/[id]/edit/page.tsx`：

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getPet } from '@/lib/db/pets'
import PetForm from '@/components/pet/PetForm'
import Loading from '@/components/ui/Loading'
import type { Pet } from '@/types'

export default function EditPetPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getPet(id).then((p) => { setPet(p); setLoading(false) })
  }, [id])

  if (authLoading || loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }
  if (!pet) return <p className="text-center py-20 text-gray-400">宠物不存在</p>
  if (pet.owner_id !== user.id) { router.push(`/pets/${id}`); return null }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">编辑 {pet.name}</h1>
      </div>
      <PetForm userId={user.id} pet={pet} />
    </div>
  )
}
```

- [ ] **Step 6: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add pet profile CRUD (create, view, edit) with GPS collar status"
```

---

## Phase 6: 私信系统

### Task 6.1: 聊天功能

**Files:**
- Create: `src/components/chat/ConversationList.tsx`, `src/components/chat/ChatWindow.tsx`
- Modify: `src/app/messages/page.tsx`
- Create: `src/app/messages/[id]/page.tsx`
- Create: `src/lib/hooks/useMessages.ts`

- [ ] **Step 1: useMessages Hook**

创建 `/Users/yu/pet-ecosystem/src/lib/hooks/useMessages.ts`：

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getConversations, getMessages, sendMessage, getOrCreateConversation, subscribeMessages } from '@/lib/db/messages'
import type { Conversation, Message } from '@/types'

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setConversations([]); setLoading(false); return }
    getConversations(userId).then((data) => {
      setConversations(data)
      setLoading(false)
    })
  }, [userId])

  return { conversations, loading }
}

export function useChat(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return
    getMessages(conversationId).then((data) => {
      setMessages(data)
      setLoading(false)
    })

    const sub = subscribeMessages(conversationId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg])
    })

    return () => { sub.unsubscribe() }
  }, [conversationId])

  const send = async (senderId: string, content: string, imageUrl?: string) => {
    if (!conversationId) return null
    const msg = await sendMessage(conversationId, senderId, content, imageUrl)
    if (msg) setMessages((prev) => [...prev, msg])
    return msg
  }

  return { messages, loading, send }
}
```

- [ ] **Step 2: ConversationList 组件**

创建 `/Users/yu/pet-ecosystem/src/components/chat/ConversationList.tsx`：

```tsx
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'

interface ConversationListProps {
  conversations: any[]
}

export default function ConversationList({ conversations }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">💬</p>
        <p className="text-gray-400">暂无消息</p>
        <p className="text-gray-300 text-sm mt-1">去地图发现宠友，开始聊天吧</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
        >
          <Avatar
            src={conv.other_user?.avatar_url}
            name={conv.other_user?.nickname || '用户'}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900">
              {conv.other_user?.nickname || '未知用户'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(conv.last_message_at).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: ChatWindow 组件**

创建 `/Users/yu/pet-ecosystem/src/components/chat/ChatWindow.tsx`：

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useChat } from '@/lib/hooks/useMessages'
import Button from '@/components/ui/Button'
import type { Message } from '@/types'

interface ChatWindowProps {
  conversationId: string
  otherUserName?: string
}

export default function ChatWindow({ conversationId, otherUserName }: ChatWindowProps) {
  const { user } = useAuth()
  const { messages, loading, send } = useChat(conversationId)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !user) return
    await send(user.id, text.trim())
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-400">加载中...</p>

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                isMe
                  ? 'bg-primary-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}>
                {msg.content}
                {msg.image_url && (
                  <img src={msg.image_url} alt="" className="mt-1 rounded-lg max-w-full" />
                )}
                <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 输入栏 */}
      <div className="border-t bg-white px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 outline-none text-sm"
          />
          <Button
            size="sm"
            disabled={!text.trim()}
            onClick={handleSend}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 更新消息页和聊天页**

修改 `/Users/yu/pet-ecosystem/src/app/messages/page.tsx`：

```tsx
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useConversations } from '@/lib/hooks/useMessages'
import TabBar from '@/components/layout/TabBar'
import ConversationList from '@/components/chat/ConversationList'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const { conversations, loading } = useConversations(user?.id)

  if (authLoading) return <Loading />
  if (!user) {
    return (
      <>
        <div className="pb-14 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-gray-500 mb-4">请先登录后查看消息</p>
          <Link href="/auth/login" className="bg-primary-500 text-white px-6 py-2 rounded-full text-sm">
            登录
          </Link>
        </div>
        <TabBar />
      </>
    )
  }

  return (
    <>
      <div className="pb-14">
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold">💬 消息</h1>
        </div>
        {loading ? <Loading /> : <ConversationList conversations={conversations} />}
      </div>
      <TabBar />
    </>
  )
}
```

创建 `/Users/yu/pet-ecosystem/src/app/messages/[id]/page.tsx`：

```tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import ChatWindow from '@/components/chat/ChatWindow'
import Loading from '@/components/ui/Loading'

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="font-semibold">聊天</h1>
      </div>
      <ChatWindow conversationId={id} />
    </>
  )
}
```

- [ ] **Step 5: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add real-time messaging with conversation list and chat window"
```

---

## Phase 7: 宠物追踪

### Task 7.1: 追踪地图页面

**Files:**
- Create: `src/app/pets/tracking/page.tsx`
- Create: `src/lib/hooks/useTracking.ts`

- [ ] **Step 1: useTracking Hook**

创建 `/Users/yu/pet-ecosystem/src/lib/hooks/useTracking.ts`：

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getCollarForPet, getTrackingRecords, addTrackingRecord } from '@/lib/db/tracking'
import type { TrackingCollar, TrackingRecord } from '@/types'

export function useTracking(petId: string | undefined) {
  const [collar, setCollar] = useState<TrackingCollar | null>(null)
  const [records, setRecords] = useState<TrackingRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!petId) return
    async function load() {
      const c = await getCollarForPet(petId)
      setCollar(c)
      if (c) {
        const r = await getTrackingRecords(c.id)
        setRecords(r)
      }
      setLoading(false)
    }
    load()
  }, [petId])

  // 模拟位置更新（MVP阶段）
  const simulateUpdate = async (lat: number, lng: number) => {
    if (!collar) return
    const record = await addTrackingRecord(collar.id, lat, lng)
    if (record) setRecords((prev) => [...prev, record])
  }

  return { collar, records, loading, simulateUpdate }
}
```

- [ ] **Step 2: 追踪地图页面**

创建 `/Users/yu/pet-ecosystem/src/app/pets/tracking/page.tsx`：

```tsx
'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAMap } from '@/lib/hooks/useAMap'
import { useTracking } from '@/lib/hooks/useTracking'
import Loading from '@/components/ui/Loading'

export default function TrackingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const petId = searchParams.get('petId') || undefined
  const { user } = useAuth()
  const { collar, records, loading: dataLoading, simulateUpdate } = useTracking(petId)
  const { loaded, error: mapError } = useAMap()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const pathRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current) return

    const AMap = window.AMap
    mapInstance.current = new AMap.Map(mapRef.current, {
      zoom: 15,
      center: [115.656, 34.414],
    })

    return () => { mapInstance.current?.destroy() }
  }, [loaded])

  // 绘制轨迹
  useEffect(() => {
    if (!mapInstance.current || !loaded || records.length === 0) return
    const AMap = window.AMap

    // 清除旧绘制
    if (pathRef.current) { pathRef.current.setMap(null) }
    if (markerRef.current) { markerRef.current.setMap(null) }

    // 路径线
    const path = records.map((r) => [r.lng, r.lat])
    pathRef.current = new AMap.Polyline({
      path,
      strokeColor: '#4CAF50',
      strokeWeight: 4,
      strokeOpacity: 0.7,
    })
    pathRef.current.setMap(mapInstance.current)

    // 当前位置标记
    const last = records[records.length - 1]
    markerRef.current = new AMap.Marker({
      position: [last.lng, last.lat],
      icon: new AMap.Icon({
        size: [32, 32],
        image: `data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#4CAF50" opacity="0.3"/>
            <circle cx="16" cy="16" r="8" fill="#4CAF50"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        `)}`,
      }),
    })
    markerRef.current.setMap(mapInstance.current)

    // 自动缩放至完整轨迹
    mapInstance.current.setFitView([pathRef.current])
  }, [records, loaded])

  // 模拟位置更新
  const handleSimulate = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude + (Math.random() - 0.5) * 0.005
        const lng = pos.coords.longitude + (Math.random() - 0.5) * 0.005
        simulateUpdate(lat, lng)
      },
      () => {
        // 降级：商丘随机坐标
        const lat = 34.414 + (Math.random() - 0.5) * 0.02
        const lng = 115.656 + (Math.random() - 0.5) * 0.02
        simulateUpdate(lat, lng)
      }
    )
  }, [simulateUpdate])

  if (!user) { router.push('/auth/login'); return null }
  if (mapError) return <p className="text-center py-10 text-red-500">{mapError}</p>
  if (dataLoading) return <Loading />

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />

      {/* 顶栏 */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-white/90 backdrop-blur m-3 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-600 font-medium">← 返回</button>
            <div className="text-center">
              <p className="font-semibold text-sm">
                {collar ? '🟢 追踪中' : '🔴 未绑定项圈'}
              </p>
              {collar && (
                <p className="text-xs text-gray-400">
                  电量 {collar.battery_level}% · {records.length} 个位置点
                </p>
              )}
            </div>
            <div className="w-12" />
          </div>
        </div>
      </div>

      {/* 模拟按钮 (MVP) */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
        <button
          onClick={handleSimulate}
          className="bg-primary-500 text-white px-6 py-3 rounded-full shadow-lg font-medium active:scale-95 transition-all"
        >
          📍 模拟位置上报
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add GPS tracking map with trajectory drawing and simulated location updates"
```

---

## Phase 8: 个人中心

### Task 8.1: 完善个人中心页面

**Files:**
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: 个人中心完整实现**

修改 `/Users/yu/pet-ecosystem/src/app/profile/page.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePets } from '@/lib/hooks/usePets'
import { subscribeUser } from '@/lib/db/profiles'
import { createCollar } from '@/lib/db/tracking'
import TabBar from '@/components/layout/TabBar'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'
import type { Pet } from '@/types'

export default function ProfilePage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const { pets, loading: petsLoading, refresh: refreshPets } = usePets(user?.id)
  const router = useRouter()
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [subscribeForm, setSubscribeForm] = useState({ address: '', petId: '' })
  const [subscribed, setSubscribed] = useState(false)

  if (authLoading) return <Loading />
  if (!user) {
    return (
      <>
        <div className="pb-14 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-5xl mb-4">🐾</p>
          <p className="text-gray-600 mb-1 font-semibold text-lg">欢迎来到宠物生态平台</p>
          <p className="text-gray-400 text-sm mb-6">登录后可管理宠物、查看追踪、与宠友交流</p>
          <Link href="/auth/login" className="bg-primary-500 text-white px-8 py-3 rounded-full font-medium">
            手机号登录
          </Link>
        </div>
        <TabBar />
      </>
    )
  }

  const handleSubscribe = async () => {
    if (!subscribeForm.address.trim() || !subscribeForm.petId) return
    await subscribeUser(user.id)
    // 创建模拟项圈
    await createCollar(
      user.id,
      subscribeForm.petId,
      `COL-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    )
    setSubscribed(true)
    refreshPets()
  }

  return (
    <>
      <div className="pb-14">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-b from-primary-100 to-white px-4 pt-8 pb-4">
          <div className="flex items-center gap-4">
            <Avatar src={profile?.avatar_url} name={profile?.nickname || '用户'} size="xl" />
            <div>
              <h2 className="text-xl font-bold">{profile?.nickname || '宠友'}</h2>
              <p className="text-gray-500 text-sm">{profile?.phone || user.phone || ''}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                profile?.is_subscribed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {profile?.is_subscribed ? '✅ 已订阅 · 已领项圈' : '📦 未订阅'}
              </span>
            </div>
          </div>
        </div>

        {/* 订阅送项圈（未订阅时显示） */}
        {!profile?.is_subscribed && (
          <div className="px-4 mt-3">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎁</span>
                <div className="flex-1">
                  <p className="font-bold text-amber-800">订阅即送GPS追踪项圈</p>
                  <p className="text-xs text-amber-600">实时查看宠物位置，永不离线</p>
                </div>
                <Button size="sm" onClick={() => setShowSubscribe(true)}>
                  立即领取
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 我的宠物 */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">🐾 我的宠物</h3>
            <Link href="/pets/new" className="text-primary-500 text-sm font-medium">
              + 添加
            </Link>
          </div>

          {petsLoading ? (
            <Loading />
          ) : pets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-3xl mb-2">🐣</p>
              <p className="text-gray-400 text-sm">还没有宠物档案</p>
              <Link href="/pets/new" className="text-primary-500 text-sm mt-1 inline-block">
                创建第一个 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pets.map((pet: Pet) => (
                <Link
                  key={pet.id}
                  href={`/pets/${pet.id}`}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 active:scale-[0.98] transition-all"
                >
                  <span className="text-3xl">
                    {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐹'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{pet.name}</p>
                    <p className="text-xs text-gray-400">
                      {pet.breed} · {pet.age}个月 · {pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : ''}
                    </p>
                  </div>
                  <span className="text-gray-300">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 功能入口 */}
        <div className="px-4 mt-6">
          <h3 className="font-bold text-lg mb-3">⚡ 快捷功能</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '📍', label: '宠物追踪', href: '/pets/tracking' },
              { icon: '📦', label: '我的订单', href: '/orders' },
              { icon: '⚙️', label: '设置', href: '#' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="bg-gray-50 rounded-xl p-3 text-center active:scale-95 transition-all"
              >
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="text-xs text-gray-600">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 退出 */}
        <div className="px-4 mt-8 mb-6">
          <button
            onClick={() => signOut()}
            className="w-full text-gray-400 text-sm py-3"
          >
            退出登录
          </button>
        </div>
      </div>

      <TabBar />

      {/* 订阅弹窗 */}
      <Modal
        isOpen={showSubscribe}
        onClose={() => setShowSubscribe(false)}
        title={subscribed ? '🎉 领取成功' : '🎁 订阅送追踪项圈'}
      >
        {subscribed ? (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-semibold text-gray-900">恭喜！您已成功订阅</p>
            <p className="text-gray-500 text-sm mt-1">GPS追踪项圈将在3-5个工作日内发货</p>
            <p className="text-gray-400 text-xs mt-2">设备编号已生成，届时绑定宠物即可使用</p>
            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={() => setShowSubscribe(false)}
            >
              知道了
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">
              订阅我们的平台，即可<b>免费获得</b>一个GPS宠物追踪项圈。实时查看宠物位置，守护TA的安全。
            </p>
            {pets.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 mb-3">请先创建宠物档案</p>
                <Link
                  href="/pets/new"
                  className="text-primary-500 font-medium"
                  onClick={() => setShowSubscribe(false)}
                >
                  → 去创建
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择佩戴项圈的宠物
                  </label>
                  <select
                    value={subscribeForm.petId}
                    onChange={(e) => setSubscribeForm({ ...subscribeForm, petId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none"
                  >
                    <option value="">请选择</option>
                    {pets.map((pet: Pet) => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    收货地址
                  </label>
                  <input
                    type="text"
                    value={subscribeForm.address}
                    onChange={(e) => setSubscribeForm({ ...subscribeForm, address: e.target.value })}
                    placeholder="请输入收货地址"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!subscribeForm.address.trim() || !subscribeForm.petId}
                  onClick={handleSubscribe}
                >
                  确认订阅并领取项圈
                </Button>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  )
}
```

- [ ] **Step 2: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: complete profile page with pet list, subscription flow, and collar claim"
```

---

## Phase 9: 订单页面

### Task 9.1: 我的订单页面

**Files:**
- Create: `src/app/orders/page.tsx`

- [ ] **Step 1: 订单列表页**

创建 `/Users/yu/pet-ecosystem/src/app/orders/page.tsx`：

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getMyOrders } from '@/lib/db/orders'
import Loading from '@/components/ui/Loading'
import type { Order } from '@/types'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '待确认', color: 'text-yellow-500' },
  confirmed: { label: '已确认', color: 'text-blue-500' },
  delivering: { label: '配送中', color: 'text-purple-500' },
  done: { label: '已完成', color: 'text-green-500' },
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    getMyOrders(user.id).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [user])

  if (authLoading || loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">📦 我的订单</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-400">暂无订单</p>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">
          {orders.map((order) => {
            const status = statusLabels[order.status]
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                  <span className={`text-xs font-medium ${status?.color}`}>
                    {status?.label}
                  </span>
                </div>
                {(order.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span>{item.product_name} x{item.quantity}</span>
                    <span className="text-gray-500">¥{item.price}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between">
                  <span className="text-sm text-gray-500">合计</span>
                  <span className="font-bold text-primary-500">¥{order.total_amount}</span>
                </div>
                {order.delivery_address && (
                  <p className="text-xs text-gray-400 mt-1">📍 {order.delivery_address}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add order history page"
```

---

## Phase 10: 种子数据 & 部署

### Task 10.1: 商丘宠物店铺种子数据

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: 商丘种子数据**

创建 `/Users/yu/pet-ecosystem/supabase/seed.sql`：

```sql
-- 商丘市宠物店铺 & 医院种子数据 (约15条)
-- 实际部署前，需要手动在高德地图搜索"宠物"获取更全面的POI

INSERT INTO shops (name, type, address, lat, lng, phone, business_hours, rating, cover_image, description) VALUES

-- 宠物医院
('商丘爱宠宠物医院', 'pet_hospital', '梁园区神火大道与民主路交叉口南100米', 34.425, 115.658, '0370-2222120', '08:00-20:00', 4.5, NULL, '商丘专业宠物医疗机构，提供宠物诊疗、手术、疫苗、体检等服务。'),
('派特宠物医院', 'pet_hospital', '睢阳区南京路与凯旋路交叉口东200米', 34.408, 115.650, '0370-3333120', '09:00-21:00', 4.3, NULL, '24小时急诊宠物医院，配备DR、B超、生化仪等设备。'),
('萌宠堂宠物诊所', 'pet_hospital', '梁园区文化路与团结路交叉口', 34.420, 115.665, '0370-5555120', '08:30-18:30', 4.0, NULL, '宠物基础诊疗、疫苗注射、体外驱虫等。'),
('瑞鹏宠物医院(商丘分院)', 'pet_hospital', '睢阳区归德路北段万达广场对面', 34.415, 115.662, '0370-6666120', '08:00-21:00', 4.7, NULL, '全国连锁宠物医院品牌，提供全科诊疗、专科服务。'),

-- 宠物店
('萌爪宠物生活馆', 'pet_shop', '梁园区前进路与民主路交叉口北50米', 34.427, 115.655, '13837001234', '09:00-20:00', 4.2, NULL, '宠物食品、用品、玩具一站式购物，品牌齐全。'),
('汪星人宠物店', 'pet_shop', '睢阳区神火大道南段碧桂园楼下', 34.402, 115.660, '15937005678', '09:00-21:00', 4.1, NULL, '主营宠物食品、零食、牵引绳、窝垫等用品。'),
('喵星球猫舍生活馆', 'pet_shop', '梁园区凯旋路与八一路交叉口', 34.419, 115.648, '18537009012', '10:00-19:00', 4.4, NULL, '猫咪专属用品店，进口猫粮、猫砂、猫爬架、猫玩具等。'),
('乐宠宠物用品', 'pet_shop', '睢阳区南京路丹尼斯对面', 34.408, 115.655, '13703701234', '08:30-20:30', 3.9, NULL, '平价宠物用品超市，品种丰富，价格实惠。'),
('宠爱有家', 'pet_shop', '梁园区团结路与神火大道交叉口', 34.422, 115.660, '13633708888', '09:00-20:00', 4.0, NULL, '宠物食品、用品、活体销售、宠物寄养。'),

-- 美容洗护
('狗狗秀宠物美容', 'grooming', '梁园区民主路西段', 34.425, 115.645, '15237004567', '09:00-18:00', 4.3, NULL, '专业宠物美容，洗澡、修剪、造型、SPA。'),
('泡泡宠物洗护中心', 'grooming', '睢阳区归德路与香君路交叉口', 34.410, 115.668, '15837002345', '09:30-19:00', 4.2, NULL, '宠物洗澡、美容、药浴、除螨服务。'),
('美美哒宠物造型', 'grooming', '梁园区八一路与平原路交叉口', 34.422, 115.640, '13937007890', '10:00-18:00', 4.5, NULL, '创意宠物造型，赛级美容，猫咪专业洗护。'),
('贝贝宠物美容馆', 'grooming', '睢阳区文化路与神火大道交叉口东', 34.418, 115.662, '15037006789', '09:00-19:30', 3.8, NULL, '宠物洗护、修剪、拔耳毛、剪指甲等基础护理。');

-- 示例商品 (关联到萌爪宠物生活馆)
INSERT INTO shop_products (shop_id, name, category, price, delivery_available) VALUES
((SELECT id FROM shops WHERE name = '萌爪宠物生活馆' LIMIT 1), '皇家小型犬成犬粮 2kg', 'food', 128, true),
((SELECT id FROM shops WHERE name = '萌爪宠物生活馆' LIMIT 1), '比瑞吉天然猫粮 1.5kg', 'food', 89, true),
((SELECT id FROM shops WHERE name = '萌爪宠物生活馆' LIMIT 1), '宠物尿垫 50片装', 'supplies', 35, true),
((SELECT id FROM shops WHERE name = '萌爪宠物生活馆' LIMIT 1), '狗狗磨牙棒 10根装', 'food', 25, true),
((SELECT id FROM shops WHERE name = '萌爪宠物生活馆' LIMIT 1), '宠物指甲剪+锉刀套装', 'supplies', 45, false);

-- 示例商品 (关联到汪星人宠物店)
INSERT INTO shop_products (shop_id, name, category, price, delivery_available) VALUES
((SELECT id FROM shops WHERE name = '汪星人宠物店' LIMIT 1), '冠能幼犬粮 1.5kg', 'food', 98, true),
((SELECT id FROM shops WHERE name = '汪星人宠物店' LIMIT 1), '狗狗牵引绳 反光款', 'supplies', 39, true);

-- 示例服务 (关联到狗狗秀宠物美容)
INSERT INTO shop_products (shop_id, name, category, price, delivery_available) VALUES
((SELECT id FROM shops WHERE name = '狗狗秀宠物美容' LIMIT 1), '小型犬精致洗护', 'service', 88, false),
((SELECT id FROM shops WHERE name = '狗狗秀宠物美容' LIMIT 1), '大型犬全套美容', 'service', 168, false),
((SELECT id FROM shops WHERE name = '狗狗秀宠物美容' LIMIT 1), '猫咪专业洗护', 'service', 128, false);

-- 示例服务 (关联到爱宠宠物医院)
INSERT INTO shop_products (shop_id, name, category, price, delivery_available) VALUES
((SELECT id FROM shops WHERE name = '商丘爱宠宠物医院' LIMIT 1), '宠物基础体检', 'service', 68, false),
((SELECT id FROM shops WHERE name = '商丘爱宠宠物医院' LIMIT 1), '狂犬疫苗注射', 'service', 80, false),
((SELECT id FROM shops WHERE name = '商丘爱宠宠物医院' LIMIT 1), '体外驱虫', 'service', 50, false);
```

- [ ] **Step 2: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "feat: add Shangqiu pet shop seed data (15 shops, sample products)"
```

---

### Task 10.2: 部署到 Vercel

- [ ] **Step 1: 在 Supabase 控制台执行迁移**

```bash
# 1. 登录 supabase.com，创建项目
# 2. 在 SQL Editor 中执行 supabase/migrations/00001_initial_schema.sql
# 3. 在 SQL Editor 中执行 supabase/seed.sql
# 4. 在 Authentication > Settings 中启用手机号登录
# 5. 复制项目 URL 和 anon key 到 .env.local
```

- [ ] **Step 2: 在 Vercel 部署**

```bash
cd /Users/yu/pet-ecosystem
git remote add origin <your-github-repo-url>
git push -u origin main
# 然后在 vercel.com 导入 GitHub 仓库，自动部署
# 配置环境变量: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_AMAP_KEY
```

- [ ] **Step 3: 在高德开放平台配置**

```
# 1. 注册 https://console.amap.com/
# 2. 创建应用 → 添加 Key → 服务平台选择 "Web端(JS API)"
# 3. 将 Key 填入 .env.local 和 Vercel 环境变量
```

- [ ] **Step 4: 提交**

```bash
cd /Users/yu/pet-ecosystem
git add -A && git commit -m "docs: add deployment instructions"
```

---

## 附录：本地开发命令速查

```bash
# 启动开发服务器
cd /Users/yu/pet-ecosystem && npm run dev
# 访问 http://localhost:3000

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

---

## 附录：前置准备工作清单

在开始编码前，需要完成以下注册：

1. **[Supabase](https://supabase.com)** — 注册账号，创建项目，获取 URL + anon key
2. **[高德开放平台](https://console.amap.com)** — 注册账号，创建 Web JS API 应用，获取 Key
3. **[GitHub](https://github.com)** — 创建仓库用于代码托管和 Vercel 部署
4. **[Vercel](https://vercel.com)** — 注册账号（用 GitHub 登录），用于部署
