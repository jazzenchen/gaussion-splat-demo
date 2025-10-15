import * as pc from 'playcanvas';

export class CharacterController extends pc.Script {
    // 移动速度
    moveSpeed = 3;
    
    // 旋转速度
    rotationSpeed = 10;
    
    // 相机引用
    cameraEntity: pc.Entity | null = null;
    
    // 动画组件
    animComponent: pc.AnimComponent | null = null;
    
    // 按键状态
    keys: { [key: string]: boolean } = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };
    
    // 当前是否在移动
    isMoving = false;
    
    initialize() {
        // 查找相机实体
        this.cameraEntity = this.app.root.findByName('Camera') as pc.Entity;
        
        if (!this.cameraEntity) {
            console.error('❌ 未找到相机实体');
        }
        
        // 注意：动画组件会在稍后添加，所以在 update 中获取
        
        // 键盘事件监听
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        console.log('✅ 角色控制器初始化成功');
    }
    
    onKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        if (key in this.keys) {
            this.keys[key] = true;
            event.preventDefault();
        }
    };
    
    onKeyUp = (event: KeyboardEvent) => {
        const key = event.key;
        if (key in this.keys) {
            this.keys[key] = false;
            event.preventDefault();
        }
    };
    
    update(dt: number) {
        if (!this.cameraEntity) return;
        
        // 延迟获取动画组件（在 React useEffect 添加后）
        if (!this.animComponent) {
            this.animComponent = this.entity.anim as pc.AnimComponent;
            if (this.animComponent) {
                console.log('✅ 动画组件已获取');
            }
        }
        
        if (!this.animComponent) return;
        
        // 计算移动方向
        const moveDirection = new pc.Vec3(0, 0, 0);
        
        // 获取相机的 forward 方向
        const cameraForward = this.cameraEntity.forward.clone();
        
        // 去掉 y 轴，投影到水平面
        cameraForward.y = 0;
        
        // 标准化作为前进方向
        if (cameraForward.length() > 0.001) {
            cameraForward.normalize();
        } else {
            // 如果相机垂直向下，使用默认方向
            cameraForward.set(0, 0, 1);
        }
        
        // 计算右方向（水平面上）
        const cameraRight = this.cameraEntity.right.clone();
        cameraRight.y = 0;
        if (cameraRight.length() > 0.001) {
            cameraRight.normalize();
        } else {
            cameraRight.set(1, 0, 0);
        }
        
        // 根据按键计算移动方向
        if (this.keys.ArrowUp) {
            moveDirection.add(cameraForward);
        }
        if (this.keys.ArrowDown) {
            moveDirection.sub(cameraForward);
        }
        if (this.keys.ArrowLeft) {
            moveDirection.sub(cameraRight);
        }
        if (this.keys.ArrowRight) {
            moveDirection.add(cameraRight);
        }
        
        // 检查是否在移动
        const wasMoving = this.isMoving;
        this.isMoving = moveDirection.length() > 0;
        
        // 如果在移动
        if (this.isMoving) {
            // 标准化移动方向
            moveDirection.normalize();
            
            // 获取当前朝向（水平面上）
            const currentForward = this.entity.forward.clone();
            currentForward.y = 0;
            if (currentForward.length() > 0.001) {
                currentForward.normalize();
            } else {
                currentForward.set(0, 0, 1);
            }
            
            // 目标朝向就是移动方向
            const targetForward = moveDirection.clone()
            targetForward.y = 0;
            targetForward.x = -targetForward.x;
            targetForward.z = -targetForward.z;
            
            // 使用插值平滑旋转
            const t = Math.min(1, this.rotationSpeed * dt);
            const smoothForward = new pc.Vec3();
            smoothForward.lerp(currentForward, targetForward, t);
            smoothForward.normalize();
            
            // 设置角色朝向（lookAt 一个相对位置）
            const currentPos = this.entity.getPosition();
            const targetLookAt = currentPos.clone().add(smoothForward);
            this.entity.lookAt(targetLookAt);
            
            // 移动角色
            moveDirection.mulScalar(this.moveSpeed * dt);
            this.entity.translate(moveDirection);
            
            // 切换到行走动画
            if (!wasMoving && this.animComponent.baseLayer) {
                console.log('🚶 切换到 walk 动画');
                this.animComponent.baseLayer.transition('walk', 0.2);
            }
        } else {
            // 停止移动，切换到idle动画
            if (wasMoving && this.animComponent.baseLayer) {
                console.log('🧍 切换到 idle 动画');
                this.animComponent.baseLayer.transition('idle', 0.2);
            }
        }
    }
    
    destroy() {
        // 清理事件监听
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
}

