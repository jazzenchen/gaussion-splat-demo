# Gaussian Splat Demo

这是一个使用 PlayCanvas 和 Next.js 构建的高斯溅射（Gaussian Splatting）演示项目。

本项目为一个 monorepo，使用 [pnpm](https://pnpm.io/) 和 [Turborepo](https://turbo.build/repo) 进行管理。

## 技术栈

- **构建工具**: Turborepo
- **包管理器**: pnpm
- **Web 框架**: Next.js / React
- **语言**: TypeScript
- **3D 渲染**: PlayCanvas

## 项目结构

代码主要位于 `src` 目录下：

- `src/apps/web`: 高斯溅射查看器主程序。
- `src/apps/docs`: 项目文档站点。
- `src/packages/ui`: 共享的 UI 组件库。
- `src/packages/eslint-config`: 共享的 ESLint 配置。
- `src/packages/typescript-config`: 共享的 TypeScript 配置。

## 本地开发

### 1. 环境准备

请确保您已安装 [Node.js](https://nodejs.org/) (>=18) 和 [pnpm](https://pnpm.io/installation)。

### 2. 进入工作目录

所有命令都需要在 `src` 目录下执行。

```bash
cd src
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 启动开发服务器

此命令将启动所有应用（`web` 和 `docs`）的开发模式。

```bash
pnpm dev
```

- `web` 应用通常会运行在 [http://localhost:3000](http://localhost:3000)
- `docs` 应用通常会运行在 [http://localhost:3001](http://localhost:3001)

## 可用脚本

以下脚本均需在 `src` 目录下运行：

- `pnpm dev`: 启动开发环境。
- `pnpm build`: 构建所有应用和包用于生产环境。
- `pnpm lint`: 对代码进行静态检查。
- `pnpm format`: 格式化所有代码文件。

## 参考资料
https://stackblitz.com/edit/pc-react-gaussian-splats-cgrtbprm?file=package.json

