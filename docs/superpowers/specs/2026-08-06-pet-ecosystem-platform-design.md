# 宠物生态平台 — 产品设计文档

> **日期：** 2026-08-06
> **版本：** v1.0
> **状态：** 待实施

---

## 一、项目概述

打造以商丘市为首发城市的宠物生态平台 Web App。以地图为核心入口，整合宠物店铺/医院POI、用户宠物档案、私信社交、宠物GPS追踪等能力，构建"宠物界的微信+美团"。

### 首发城市

商丘市（梁园区 + 睢阳区），后续扩展至全国。

### 目标用户

- 商丘市区宠物主人（养猫/养狗为主）
- 商丘本地宠物店铺、宠物医院
- 后续扩展至宠物服务提供者（美容师、遛狗师等）

---

## 二、技术架构

```
用户手机浏览器（Web App，移动端响应式）
        │
        ▼
┌─────────────────────────────────┐
│  Next.js 14 + React + TypeScript │  ← 前端框架
│  Tailwind CSS                     │  ← 样式
│  高德地图 JS API 2.0              │  ← 地图
├─────────────────────────────────┤
│  Supabase                         │  ← 后端+数据库+认证+实时通信
│  ├── Auth (手机号注册登录)         │
│  ├── PostgreSQL (业务数据)        │
│  ├── Realtime (私信实时推送)       │
│  └── Storage (图片存储)           │
├─────────────────────────────────┤
│  Vercel (免费部署)                │
└─────────────────────────────────┘
```

### 技术选型理由

- **Next.js + Tailwind：** AI编码工具最擅长生成的组合，出错率最低
- **Supabase：** 免去自己写后端、配服务器、管数据库、做用户系统的80%工作量
- **高德地图：** 国内最成熟的地图API，商丘POI覆盖全，中文文档
- **Vercel：** 代码推送即部署，零运维

---

## 三、页面结构 & 功能模块

### 底部导航（5个Tab）

| Tab | 名称 | 功能 |
|-----|------|------|
| 📍 | 地图 | 首页，全屏地图展示商丘宠物店铺/医院/宠物位置 |
| 🔍 | 发现 | 店铺黄页列表，分类浏览 |
| 💬 | 消息 | 私信会话列表 |
| 👤 | 我的 | 个人中心、宠物档案、追踪、订单 |

### Tab 1 — 📍 地图（首页）

- 全屏高德地图，默认展示商丘市区
- 三种标记点：🏥宠物医院(红色) / 🏪宠物店铺(蓝色) / 🐾在线宠物(绿色)
- 顶部搜索框：搜索店铺/医院名称
- 筛选按钮：按类型筛选标记
- 点击标记弹出信息卡片，可跳转详情
- 定位按钮：回到当前GPS位置

### Tab 2 — 🔍 发现（店铺黄页）

- 按距离排序的店铺/医院列表
- 分类：全部 / 宠物店 / 宠物医院 / 美容洗护
- 店铺卡片：封面图、名称、标签、评分、距离
- 点击进入详情页

### 店铺/医院详情页

- 头图 + 基本信息（名称、地址、电话、营业时间、评分）
- 商品/服务列表（含价格）
- 一键导航（调起高德地图）
- 在线咨询（跳转私信）
- 预约服务（简单表单）

### Tab 3 — 💬 消息

- 私信会话列表，按时间排序
- 一对一实时聊天（文字+图片）
- 聊天中可发送宠物档案卡片
- 系统通知（追踪告警、订单状态）

### Tab 4 — 👤 我的

- 用户头像、昵称
- 我的宠物（档案列表，可编辑）
- GPS追踪入口
- 订阅/项圈状态
- 我的订单
- 设置

### 宠物档案（子页面）

- 照片墙（头像+生活照）
- 基础信息（名字、品种、年龄、性别、体重）
- 健康卡片（疫苗、驱虫、过敏）
- 追踪状态（在线/离线/电量/最后位置）
- 实时追踪入口
- 分享按钮（生成宠物信息卡片）

### 宠物追踪（子页面）

- 实时地图显示宠物位置
- 轨迹回放
- 电子围栏（安全区域告警）

---

## 四、数据库设计（Supabase PostgreSQL）

### 表关系

```
profiles (用户)
  ├── pets (宠物档案)
  │     └── tracking_collars (追踪项圈)
  │           └── tracking_records (GPS轨迹)
  ├── messages / conversations (私信)
  ├── orders (购买订单)
  └── appointments (服务预约)

shops (店铺/医院)
  ├── shop_products (商品/服务)
  ├── orders (订单)
  └── appointments (预约)
```

### profiles — 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 关联Supabase Auth |
| nickname | text | 昵称 |
| avatar_url | text | 头像 |
| phone | text | 手机号 |
| is_subscribed | boolean | 是否订阅（送项圈资格） |
| lat/lng | float | 最近位置 |

### pets — 宠物档案
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 主键 |
| owner_id | uuid FK→profiles | 主人 |
| name | text | 宠物名 |
| species | text | dog/cat/other |
| breed | text | 品种 |
| age | int | 年龄(月) |
| gender | text | 公/母 |
| weight | float | 体重(kg) |
| avatar_url | text | 头像 |
| photos | jsonb | 多张照片 |
| vaccine_records | jsonb | 疫苗记录 |
| allergies | text | 过敏信息 |

### shops — 店铺/医院
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 主键 |
| name | text | 店铺名 |
| type | text | pet_shop/hospital/grooming |
| address | text | 详细地址 |
| lat/lng | float | 坐标 |
| phone | text | 电话 |
| business_hours | text | 营业时间 |
| rating | float | 评分1-5 |
| cover_image | text | 门头照 |
| description | text | 简介 |

### shop_products — 商品/服务
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 主键 |
| shop_id | uuid FK→shops | 所属店铺 |
| name | text | 商品名 |
| category | text | 食品/用品/药品/服务 |
| price | float | 价格 |
| image | text | 商品图 |
| delivery_available | boolean | 是否可配送 |

### tracking_collars — 追踪项圈
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 主键 |
| owner_id | uuid FK→profiles | 所属用户 |
| pet_id | uuid FK→pets | 佩戴宠物 |
| device_serial | text | 设备编号 |
| battery_level | int | 电量% |
| last_ping_at | timestamp | 最后心跳 |

### tracking_records — GPS轨迹
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 主键 |
| collar_id | uuid FK→collars | 所属项圈 |
| lat/lng | float | 坐标 |
| recorded_at | timestamp | 记录时间 |

### conversations + messages — 私信
| 表 | 关键字段 |
|----|----------|
| conversations | participant_1, participant_2, last_message_at |
| messages | conversation_id, sender_id, content, image_url, created_at |

### orders — 订单
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid PK | 主键 |
| buyer_id | uuid FK→profiles | 买家 |
| shop_id | uuid FK→shops | 店铺 |
| items | jsonb | 商品+数量 |
| total_amount | float | 总金额 |
| status | text | pending→confirmed→delivering→done |
| delivery_address | text | 配送地址 |

---

## 五、地图集成方案

### 技术选型
- **高德地图 JS API 2.0**
- 需注册高德开放平台获取 API Key（免费额度足够 MVP）

### 标记类型

| 类型 | 图标 | 数据来源 | 交互 |
|------|------|---------|------|
| 宠物医院 | 红色十字 | shops(type=hospital) | 点击→信息窗→详情 |
| 宠物店铺 | 蓝色购物袋 | shops(type=shop/grooming) | 点击→信息窗→详情 |
| 在线宠物 | 绿色爪印 | profiles(开启位置共享) | 点击→宠物卡片 |

### 关键API

| 功能 | API |
|------|-----|
| 地图初始化 | `AMap.Map({center: [115.65, 34.41]})` |
| 标记点 | `AMap.Marker({icon, position})` |
| 信息窗 | `AMap.InfoWindow({content})` |
| 搜索自动补全 | `AMap.AutoComplete()` |
| 周边搜索 | `AMap.PlaceSearch()` |
| 用户定位 | `AMap.Geolocation()` |
| 一键导航 | `https://uri.amap.com/navigation` |

### 商丘数据冷启动
- 高德地图搜索"宠物"关键词 → 导出商丘本地宠物店/医院POI
- 批量导入shops表（预计20-50条初始数据）
- 后续店铺主自行认领/注册入驻

---

## 六、核心用户流程

### 注册 → 领项圈
```
打开App → 手机号注册 → 填写资料
  → 🎁弹出「订阅送追踪项圈」→ 填写收货地址
  → 创建第一个宠物档案 → 进入地图首页
```

### 逛地图 → 购物
```
地图首页 → 看到店铺标记 → 点击弹出卡片
  → 进入详情 → 浏览商品 → 购买（填写地址，货到付款）
  → 店铺端收到订单通知
```

### 宠物追踪
```
"我的" → "宠物追踪" → 地图显示宠物实时位置
  → 轨迹回放 / 电子围栏设置 / 出圈告警
```

### 私信聊天
```
"消息" Tab → 会话列表 → 聊天窗口
  → 发文字/图片/宠物档案卡片 → 实时送达
```

### 宠物档案分享
```
"我的" → "我的宠物" → 选择宠物 → 查看完整档案
  → "分享档案" → 生成卡片图片 → 分享到私信/朋友圈
```

---

## 七、项目边界（MVP 范围）

### 第一期 MVP 必做

- ✅ 用户注册/登录（手机号）
- ✅ 商丘地图 + 三种标记点
- ✅ 店铺/医院POI展示 + 详情页
- ✅ 宠物档案创建/编辑/查看
- ✅ 用户间私信聊天
- ✅ 宠物追踪地图（先做模拟GPS数据：用户可手动在地图上标注宠物位置，或上传位置数据模拟轨迹，待硬件到位后替换为真实项圈数据）
- ✅ 订阅送项圈流程（表单提交）
- ✅ 简单购买流程（货到付款）

### 第二期再做

- ⏳ 真实GPS项圈硬件对接
- ⏳ 在线支付接入（微信支付）
- ⏳ 配送系统对接（美团/达达开放API）
- ⏳ 店铺入驻审核后台
- ⏳ 电子围栏推送通知
- ⏳ 预约服务系统
- ⏳ 宠物社区/动态feed

---

## 八、竞争策略

详细竞品分析见 [竞品调研报告](竞品调研分析报告-2026年7月.md)。

### 核心差异化

1. **硬件+软件一体化：** 追踪项圈是"钩子"，免费送获取用户，锁定生态
2. **地图为核心：** 不是电商App，不是社交App，是"宠物版滴滴/美团"
3. **数据飞轮：** 项圈数据+购买数据+健康数据汇成统一宠物档案，切换成本极高
4. **下沉市场首发：** 商丘起步，避开头部的北上广深红海

### 市场空白

- 中国无宠物专用地图服务平台
- 中国无领导品牌GPS宠物追踪器
- 没有任何平台将"追踪+社交+电商+健康"整合
