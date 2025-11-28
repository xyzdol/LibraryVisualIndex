Library Visual Index — 图书馆可视化索引系统

一个基于 FastAPI + React + MySQL 的可视化图书馆导航与区域管理系统，支持智能浏览、地图定位、广播系统、区域热力图等功能。

项目简介

Library Visual Index 是一个图书馆区域与图书数据的可视化系统，旨在帮助用户快速定位书架、浏览区域信息、查看热门区域、发布广播、搜索书籍等。
本项目全栈实现，包括数据库、后端 API、前端界面、可视化地图、计数系统与创新功能。

核心功能
🔹 1. 图书区域浏览

展示所有图书区域信息（名称、楼层、描述）

支持点击进入对应区域的书架列表

采用渐变色卡片设计

支持访问次数计数与区域热力层叠加

🔹 2. 互动书架地图（2D 可视化）

展示每个楼层的书架坐标

点击书架可进入对应书籍列表

支持地图自动高亮与跳转

选中书架后自动滚动定位（scrollIntoView）

🔹 3. 图书搜索与详情

模糊搜索书名

显示所在区域、书架编号、位置信息

查看书目详情、状态（已借出/可借阅）

🔹 4. 用户登录 / 注册

JWT 用户认证

登录后可执行借阅、广播、评论等操作

本地存储会话保持

🔹 5. 排行榜（Top Books）

基于借阅次数统计

展示热门书籍列表

点击进入详情页

🔹 6. 借阅管理

查看“我借的书”

展示借阅期限与到期提醒

支持归还操作

🔹 7. 广播系统（支持匿名）

用户可向图书馆某个区域发布广播

支持“按区域筛选广播”

匿名广播可隐藏用户名

发布者可删除自己的广播

自适应时间显示 & UI 卡片布局优化

🔹 8. 区域热力图（访问统计）

根据 visit_count 自动渲染热力颜色

冷 → 热渐变：绿 → 黄 → 橙 → 红

数据来自 /areas/{id}/visit API

点击区域可跳转到对应书架列表

可视化展示读者区域行为分布

项目创新点
创新点 1：区域智能广播（含匿名系统）

用户可对图书馆任何区域发布广播

加入匿名发布机制保护隐私

广播可按区域筛选

发布者可删除自己的广播

UI 做遮挡修复、按钮逻辑优化、时间展示标准化

创新点 2：2D 图书馆地图 + 自动高亮定位

根据坐标绘制书架网格布局

通过 URL 参数 /map?shelf=xxx 可跳转到对应书架

自动滚动视图定位目标书架

高亮动画（pulse + ring）

用于快速导航与方向指引

创新点 3：区域热力图（访问行为可视化）

每进入一个区域自动记录访问次数

使用热力颜色展示区域热门程度

双模式切换：
✔ 普通模式（渐变背景）
✔ 热力模式（热度颜色）

用户行为数据驱动 UI，提高可视化帮助性

技术栈
Frontend

React + Vite + TypeScript

TailwindCSS

React Router

Fetch API

Backend

FastAPI

SQLAlchemy

Pydantic v2

MySQL / MariaDB

CORS Middleware

Database

area（图书区域）

shelf（书架）

book（书籍）

borrow（借阅）

broadcast（广播功能）

user（用户账号）

部署方法
1. 克隆仓库
git clone https://github.com/xxx/LibraryVisualIndex.git

2. 启动后端
cd Backend
uvicorn app.main:app --reload

3. 启动前端
cd Frontend/frontend
npm install
npm run dev

项目结构
Backend/
 ├─ app/
 │   ├─ models/         # SQLAlchemy ORM
 │   ├─ schemas/        # Pydantic schema
 │   ├─ crud/           # 数据库操作
 │   ├─ routers/        # API 路由
 │   └─ main.py         # FastAPI 入口
 └─ database.py

Frontend/
 └─ src/
     ├─ pages/          # 页面
     ├─ api/            # API 请求
     ├─ components/     # 公共组件
     └─ router/         # 路由配置
