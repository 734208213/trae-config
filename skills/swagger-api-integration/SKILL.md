---
name: swagger-api-integration
description: >
  基于 Swagger/OpenAPI 文档进行前端 API 对接的通用技能。当用户提供 Swagger 文档链接或 JSON，
  需要对现有代码进行接口对接、字段校验、逻辑合理性审查时触发。覆盖场景：新页面接口接入、
  字段名严格对齐文档定义、发现并修复反模式对接逻辑（参数传错、假分页、用通用接口代替专用统计接口、
  状态值域不匹配、自创字段名等）。适用于微信小程序、Vue、React、UniApp 等任何前端技术栈。
  当用户提到"swagger"、"API对接"、"接口联调"、"字段校验"、"检查对接逻辑"、"新增接口完善"、
  "参数和响应要对上文档"等关键词时，即使未明确要求使用此技能也应主动调用。
---

# Swagger API Integration Skill

**核心原则：Swagger schema = 单一事实来源 (Single Source of Truth)**

代码中每个字段名、每个请求参数、每个响应解析，都必须能在文档中找到对应定义。
不猜测、不创造、不复制其他项目的命名习惯。

---

## 工作流

```
Phase 1 信息收集 → Phase 2 字段对齐 → Phase 3 反模式检测 → Phase 4 UI检查(可选) → Phase 5 交付
```

各 Phase 可独立执行。用户说"检查字段"只跑 P2，说"检查逻辑问题"只跑 P3。

---

## Phase 1: 信息收集

### 输入确认

| 输入 | 必需 | 默认值 |
|------|------|--------|
| Swagger 来源（URL / JSON / 粘贴） | ✅ | — |
| 目标代码目录 | ✅ | — |
| 技术栈 | 自动检测 | 通过文件结构判断 |
| 范围限定 | 可选 | 全部文件 |

### 下载 Schema

WebFetch 获取 swagger.json 经常被截断，必须：

1. 用 `powershell Invoke-WebRequest` 下载完整 JSON 到本地临时文件
2. 用 `Read` 分段读取 `components/schemas` 部分
3. 用 `Grep` 按 schema 名精确提取所需定义

### 建立映射表

**Endpoint Map**: 每个 API 的输入输出
```
POST /Applet/User/Login → Request: LoginDto { phone, verificationCode }
                         → Response: LoginView { token, nickname, mobile, userType }
```

**Field Map**: 每个 Schema 的属性清单
```
StoreListView:
  storeId(integer), storeName(string), middleId(string), address(string),
  status(integer∈{0,1,2}), meter(string), longitude(number), latitude(number)
```

**Enum Map**: 有枚举约束的字段
```
StoreListView.status → [0, 1, 2]
StoreActivateRecordView.checkStatus → [0, 1, 2]
```

### 扫描目标代码

- `Glob` 列出 `.js` / `.ts` / `.vue` / `.wxml` / `.jsx` 文件
- `Grep` 提取 API 函数调用（如 `Store_StoreList(`）
- `Grep` 提取模板中所有字段引用（如 `{{item.xxx}}`）

输出：已对接 vs 未对接接口清单。

---

## Phase 2: 字段严格对齐

### 检测规则

**F1 — 模板字段匹配**
扫描模板中的数据绑定表达式，逐一在 Response View Schema 中查找。找不到则标记为「自创字段」。

**F2 — 请求参数匹配**
对比调用 API 时传入的 params 与 Request DTO Schema：
- params 中有但 DTO 无 → 「多余参数」
- DTO required 但 params 缺失 → 「缺少必填参数」
- key 名不一致 → 「参数命名错误」

**F3 — 枚举值域匹配**
提取筛选/条件判断中的状态常量，与 Schema enum 或 description 对比。超出范围则标记为「值域越界」。

**F4 — 类型一致性**
数字字段不做字符串比较、布尔字段用条件渲染而非数值比较。

### 差异报告格式

```markdown
## 字段差异报告

### 文件: pages/xxx/xxx.wxml
| 行号 | 代码中使用 | Swagger 定义 | 所属Schema |
|------|-----------|-------------|-----------|
| L23  | submitTime | createAt | StoreActivateRecordView |

### 文件: pages/xxx/xxx.js
| 行号 | 问题类型 | 详情 |
|------|---------|------|
| L45  | 多余参数 | GetStoreByQrCode 不接受 storeId |
| L62  | 参数命名错误 | smsCode → verificationCode |
```

### 执行原则

1. **先报告后修改**：输出差异报告，用户确认后才改
2. 同步更新关联位置：data 默认值、onLoad 解析、模板绑定、事件 data-* 传参
3. 遵循项目现有风格

---

## Phase 3: 反模式检测

6 类常见反模式，按严重程度排序。

### P1 🔴 API 参数错误

调用接口时传入该接口 Request DTO 中**不存在**的参数或类型不匹配。

**检测**：params 的每个 key 是否存在于 DTO properties 中。

**修复方向**：A) 使用正确参数 B) 改用 URL 传参 C) 换正确接口

### P2 🟡 状态值域不匹配

前端 UI 筛选选项数量或状态值范围与后端枚举不一致。

**检测**：提取 Tab/select 映射值集合，是否为后端 enum 的子集。

**修复方向**：Tab 数量与后端枚举完全对齐。

### P3 🟡 伪统计

遍历列表手动累加获取总数/分类计数，而存在专用的 Stats/Count 接口。

**检测**：发现 `pageSize: 999` + `forEach 计数` 模式时搜索是否有 `*Stats*/*Count*` 接口。

**修复方向**：使用专用统计接口替代列表遍历。

### P4 🟢 假分页

对返回**单对象 + 子数组**结构的接口做了 onReachBottom 分页加载。

**检测**：Response 是单对象（非数组）且含子数组 details/items/list，但代码有 pageIndex 翻页。

**修复方向**：去掉分页，一次性加载子数组。

### P5 🟢 当前页冒充全局计数

Tab 角标上的数字只统计了当前页数据而非全局总量。

**检测**：list.forEach 内部做 statusCounts 累加且用于 UI 显示。

**修复方向**：A) 后端补充 totalCount 字段 B) 去掉数字显示 C) 用 Stats 接口

### P6 🟡 自创字段名

使用了语义相近但非 Swagger 定义的字段名。

**检测**：同 Phase 2 的 F1/F2 规则。**以本次 Swagger schema 为唯一标准**，不套用任何预设对照表。

**修复方向**：替换为 Schema 中实际定义的字段名。

### 关联关系

P6 往往是根因，导致 P1→P2→P5 连锁出现。建议修复顺序：**先修 P6（字段对齐）→ 再修 P1（参数修正）→ 最后修 P2-P5（逻辑修正）**

---

## Phase 4: UI 完整性检查（可选）

对接完成后检查数据绑定层面的完整性：

| 检查项 | 说明 |
|--------|------|
| C1 | data 初始化覆盖了所有模板引用的字段（无 undefined 渲染） |
| C2 | wx:if/v-if 引用的变量在 data 中有定义 |
| C3 | bindtap/@click 绑定的 handler 在 js 中有实现 |
| C4 | wx:for/v-for/:key 的 key 值在 item 中存在且唯一 |
| C5 | 图片 src 为空时有占位/fallback 处理 |

> 视觉层面优化建议额外调用 ui-replica 技能。

---

## Phase 5: 交付物

### 变更报告

```markdown
# API 对接变更报告
- Swagger: [来源] | 目录: [路径] | 栈: [框架]

## 文件变更
| 文件 | 类型 | 说明 |

## API 覆盖率
| 模块 | 总数 | 已对接 | 覆盖率 |

## 反模式汇总
| 优先级 | 编号 | 数量 | 文件 |

## 字段映射（旧→新）
| 文件 | 行号 | 旧字段 | 新字段 |
```

### API 注释规范

每个 API 函数上方附带：
```
// POST /Applet/Xxx/Yyy
// Request: DtoName { field: type // 说明 }
// Response: ViewName { field: type // 说明 }
```

---

## 技术栈适配

自动检测后适配对应的扫描规则。

### 检测方法

| 特征 | 微信小程序 | Vue | React |
|------|-----------|-----|-------|
| 判定 | 存在 app.json+.wxml | .vue 文件无 wx: | .jsx/.tsx |
| 模板文件 | .wxml | .vue \<template\> | .jsx return |

### 核心语法差异

| 维度 | 微信小程序 | Vue | React |
|------|-----------|-----|-------|
| 数据绑定 | `{{x}}` | `{{ x }}` | `{x}` |
| 条件 | `wx:if` | `v-if` | `{&&}` / 三元 |
| 列表 | `wx:for` `wx:key` | `v-for` `:key` | `.map()` `key=` |
| 点击 | `bindtap="fn"` | `@click="fn"` | `onClick={fn}` |
| 传参 | `data-x="{{v}}"` | `:data-x="v"` | `data-x={v}` |
| 取参 | `e.currentTarget.dataset.x` | `$event` / 参数 | `e` / 参数 |
| 注册 | `wx.Page({})` | `export default {}` | function/hooks |
| 双向绑定 | `bindinput`+setData | `v-model` | `value`+`onChange` |

### 字段扫描正则

```
微信: \{\{[\.\w]+\}\}
Vue:   \{\{[\.\w]+\}\}    (template 区块)
React: \{[\w\?\.]+\}       (JSX 内)
API调用: \w+\(\s*\{\s*\w+:
```

### 数据流追踪点

每处字段传递都要校验：
1. API 返回 → 解构 → setData/setState → **模板渲染**
2. 用户输入 → handler → setData/setState → **API params**
3. URL 参数 → onLoad/route query → **API request / data init**
4. 上级页面 navigateTo url params → **onLoad options → data init**

---

## 执行约束

1. **字段名零容忍**：不在 Schema 中的字段必须标记，不得静默通过
2. **不猜测参数**：未在 DTO 中定义的参数不得传入
3. **不创造接口**：只使用 Swagger paths 中已有的 endpoint
4. **先报告后修改**：大规模替换前输出 diff 报告供审核
5. **保持风格一致**：遵循项目现有缩进/命名/注释风格
6. **不操作版本控制**：不执行 git/svn/pnpm publish 等命令
