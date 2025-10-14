# 应急管理系统前端

一个基于 Vue 3 + Vite + TypeScript + TailwindCSS 的现代化应急管理系统前端项目。

## 🚀 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - JavaScript的超集，提供类型安全
- **TailwindCSS** - 实用优先的CSS框架
- **Vue Router** - Vue.js官方路由管理器
- **Pinia** - Vue的状态管理库
- **Axios** - HTTP客户端
- **ESLint** - 代码质量检查工具
- **Prettier** - 代码格式化工具

## 📋 功能模块

### 模块一：演练申请（Drill Application）
- ✅ **新增演练申请** - 支持填写演练科目、类型、参演部门、组织部门、关联预案、计划时间、说明、是否影响运行
- ✅ **附件上传** - 支持上传PDF、DOC、DOCX、XLS、XLSX、JPG、PNG格式文件
- ✅ **表单校验** - 必填项校验、字数限制（说明≤500字）
- ✅ **查看详情** - 弹窗显示完整信息（含附件列表）
- ✅ **查询筛选** - 支持多条件组合查询，可重置查询条件
- ✅ **批量导入** - 支持Excel模板批量导入，自动校验数据格式

### 模块二：演练方案（Drill Plan）
- ✅ **新增/编辑方案** - 关联已提交的演练申请，填写方案说明，上传方案文档
- ✅ **查看详情** - 弹窗显示方案详细信息
- ✅ **审核功能** - 支持通过/驳回审核，审核通过后可再次驳回修改
- ✅ **删除功能** - 仅能删除已驳回状态的方案
- ✅ **查询筛选** - 支持多条件组合查询

### 统一交互规范
- ✅ **消息提示** - 成功操作蓝色气泡提示，失败操作红色气泡提示，3秒自动消失
- ✅ **弹窗关闭** - 点击"×"关闭
- ✅ **权限控制** - 按钮操作受角色权限限制
- ✅ **数据刷新** - 操作成功后自动刷新当前页面数据

## 📁 项目结构

```
emergency_ui/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 静态资源
│   │   ├── css/          # 样式文件
│   │   └── images/       # 图片资源
│   ├── components/        # 公共组件
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── index.html            # HTML模板
├── package.json          # 项目配置
├── vite.config.ts        # Vite配置
├── tailwind.config.js    # TailwindCSS配置
├── tsconfig.json         # TypeScript配置
└── README.md            # 项目说明
```

## 🛠️ 开发环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

## 📦 安装依赖

```bash
npm install
# 或
yarn install
```

## 🚀 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

开发服务器将在 `http://localhost:3000` 启动。

## 🏗️ 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建文件将输出到 `dist` 目录。

## 🔍 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

## 📝 代码检查

```bash
npm run lint
# 或
yarn lint
```

## 🎨 代码格式化

```bash
npm run format
# 或
yarn format
```

## 🌟 主要特性

- ⚡ **快速开发** - 基于Vite的热重载开发体验
- 🎯 **类型安全** - 完整的TypeScript支持
- 🎨 **现代UI** - 基于TailwindCSS的响应式设计
- 📱 **移动端友好** - 完全响应式设计
- 🔧 **开发工具** - ESLint + Prettier代码质量保证
- 📦 **模块化** - 清晰的目录结构和组件化开发
- 🚀 **性能优化** - 代码分割和懒加载
- 🔐 **状态管理** - 基于Pinia的现代化状态管理

## 📄 许可证

MIT License
