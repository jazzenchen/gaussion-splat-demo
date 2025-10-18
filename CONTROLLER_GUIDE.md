# 角色控制器使用指南

## 问题诊断

如果按键盘没反应，可能是以下原因：

### 1. 使用了错误的控制器
项目中有两个控制器，它们使用**不同的按键**：

| 控制器 | 按键 | 状态 |
|--------|------|------|
| `CharacterController` | **箭头键** (↑↓←→) | ✅ 推荐使用 |
| `AvatarMovement` | **WASD** 键 | ⚠️ 从旧格式转换的，可能不稳定 |

### 2. 焦点问题
确保浏览器窗口获得焦点（点击一下画布区域）

### 3. 控制台错误
打开浏览器控制台 (F12)，查看是否有错误信息

## 当前配置

### Avatar.tsx 现在使用 `CharacterController`

```typescript
import { CharacterController } from "@/components/playcanvas/scripts/character-controller";

<Entity
  ref={entityRef}
  rotation={[0, 180, 0]}
  position={[0, -1.6, 1.5]}
  scale={[1, 1, 1]}
>
  <Render type="asset" asset={asset} />
  <Script script={CharacterController} />
</Entity>
```

### 控制键位

**使用箭头键控制 Avatar:**
- **↑** (ArrowUp) - 前进
- **↓** (ArrowDown) - 后退
- **←** (ArrowLeft) - 左移
- **→** (ArrowRight) - 右移

## 两个控制器的区别

### CharacterController (推荐)
```typescript
// 文件: character-controller.ts
export class CharacterController extends pc.Script {
  moveSpeed = 3;
  rotationSpeed = 10;
  
  // 使用箭头键
  keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  };
}
```

**特点:**
- ✅ 完整的 TypeScript 实现
- ✅ 基于相机方向移动
- ✅ 平滑的旋转和移动
- ✅ 动画状态切换（idle/walk）
- ✅ 使用箭头键

### AvatarMovement
```typescript
// 文件: avatar-movement.ts
export class AvatarMovement extends pc.Script {
  speed = 0.09;
  
  // 使用 WASD
  // 使用 pc.KEY_W, pc.KEY_A, pc.KEY_S, pc.KEY_D
}
```

**特点:**
- ⚠️ 从旧的 PlayCanvas 脚本格式转换而来
- ⚠️ 依赖 rigidbody.teleport()
- ⚠️ 使用 WASD 键
- ⚠️ 可能与当前项目不完全兼容

## 调试步骤

### 1. 检查脚本是否初始化
打开控制台，应该看到：
```
✅ 角色控制器初始化成功
✅ 动画组件已获取
```

### 2. 检查相机
```
🎬 SplatViewer: GSplat 加载完成，现在可以加载 Avatar 了
```

### 3. 测试移动
按箭头键，控制台应该显示：
```
🚶 切换到 walk 动画
🧍 切换到 idle 动画
```

### 4. 如果还是没反应

检查以下几点：

#### a) 确认使用正确的按键
- **CharacterController**: 箭头键 ↑↓←→
- **AvatarMovement**: WASD 键

#### b) 检查 Avatar 是否已加载
在控制台查看是否有：
```
✅ Asset 加载完成
```

#### c) 点击画布获取焦点
有时需要先点击 3D 画布区域，键盘事件才能被捕获

#### d) 查看错误信息
```
❌ 未找到相机实体
❌ Anim 组件创建失败
```

## 如何切换控制器

### 使用 CharacterController (当前配置，箭头键)
```typescript
import { CharacterController } from "@/components/playcanvas/scripts/character-controller";

<Script script={CharacterController} />
```

### 使用 AvatarMovement (WASD 键)
```typescript
import { AvatarMovement } from "@/components/playcanvas/scripts/avatar-movement";

<Script script={AvatarMovement} />
```

## 自定义控制

如果你想使用 WASD 键但用 CharacterController，可以修改：

```typescript
// character-controller.ts
keys: { [key: string]: boolean } = {
  w: false,      // 前进
  s: false,      // 后退
  a: false,      // 左移
  d: false       // 右移
};

// 在 onKeyDown 和 onKeyUp 中
const key = event.key.toLowerCase();
```

## 常见问题

### Q: 为什么没有反应？
A: 确保：
1. 使用正确的按键（箭头键 vs WASD）
2. 浏览器窗口有焦点
3. 控制台没有错误
4. Avatar 已经加载完成

### Q: 可以同时使用两个控制器吗？
A: 不建议。一个 Entity 只应该有一个控制脚本，否则会冲突。

### Q: 移动方向不对？
A: CharacterController 基于相机方向，确保相机位置正确。

### Q: 想改变移动速度？
A: 修改脚本中的 `moveSpeed` 属性：
```typescript
// CharacterController
moveSpeed = 3;  // 默认值，可以调大或调小

// AvatarMovement
speed = 0.09;   // 默认值
```

## 推荐配置

对于你的 Gaussian Splat 场景：

```typescript
// Avatar.tsx
<Entity
  position={[0, -1.6, 1.5]}  // Y 轴对齐地面
  rotation={[0, 180, 0]}      // 面向相机
  scale={[1, 1, 1]}
>
  <Render type="asset" asset={asset} />
  <Script script={CharacterController} />  // 使用箭头键
</Entity>
```

**控制方式：**
- 箭头键控制 Avatar 移动
- 鼠标左键拖动控制相机旋转
- WASDQE 键控制相机移动

---

现在试试按**箭头键**移动你的 Avatar！🎮




