# Wesley GEO website

静态中文个人品牌网站，正式域名为 `https://wesleyb2b.online`，通过 GitHub `diudiuguagua-creator/wesley-geo` 和 Cloudflare Pages 部署。

## 本地预览

```powershell
npx --yes serve .
```

## Cloudflare Pages

- Framework preset：None
- Build command：留空
- Build output directory：`.`（本目录作为独立仓库时）

## 公开信息与边界

- 品牌：Wesley GEO
- 微信：Wesleyb2b
- 服务：阿里巴巴国际站、外贸独立站、中国制造网代运营
- 不公开：中文姓名、城市、从业年限、照片、邮箱、未授权客户案例和未经确认的业绩数据

## 页面

- `/`：外贸 B2B 代运营首页
- `/services`：三项企业外贸 B2B 代运营服务总览与选择方式
- `/alibaba`：阿里巴巴国际站代运营
- `/independent-site`：外贸独立站建设与运营
- `/made-in-china`：中国制造网代运营
- `/method`：诊断、规划、执行与复盘方法
- `/insights`：运营笔记中心
- `/insights/alibaba-product-keyword-traffic`：国际站产品、关键词与流量分析
- `/insights/b2b-website-launch-checklist`：B2B 独立站上线清单
- `/insights/operation-action-review`：运营动作记录与复盘
- `/tools`：渠道运营自检、运营动作复盘模板与页面上线检查表
- `/about`：关于 Wesley
- `/contact`：公开微信与咨询准备清单
- `/sitemap`：HTML 网站地图
- `/privacy`：隐私说明（`noindex,follow`）
- `/404.html`：自定义错误页（`noindex,follow`）
- `/cases`：客户案例公开状态与证据标准页（`noindex,follow`；进入主导航但不进入 XML sitemap；取得真实事实与公开授权前不发布具体案例）

## SEO 文件

- `/sitemap.xml`：14 个 canonical、可索引 URL（不包含 `/cases`）
- `/robots.txt`：允许抓取公开页面并声明 XML sitemap
- `_headers`：安全、缓存与 MIME 响应头
- `og-cover.png`：1200×630 社交分享图
- `og-cover.svg`：社交分享图的矢量源文件

## 样式文件

- `/styles.css`：全站基础视觉与通用组件
- `/service-extras.css`：三项渠道服务页的流程示例与工具卡片
- `/tools.css`：运营工具页与首页工具预览
- `/cases.css`：客户案例公开状态与证据标准页
- `/evidence-system.css`：首页、服务总览与关于页共用的“运营证据系统”视觉母版
- `/site-header-foursets.css`：全站 Foursets 节奏的蓝白灰页眉与响应式菜单

## 质量检查

```powershell
npx --yes html-validate "*.html" "insights/*.html"
node --check script.js
git diff --check
```

发布前同时检查干净 URL、内部链接、JSON-LD、XML sitemap、移动端导航和微信复制交互。
