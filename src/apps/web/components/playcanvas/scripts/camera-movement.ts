import * as pc from 'playcanvas';

export class CameraMovement extends pc.Script {
    // 鼠标灵敏度
    mouseSpeed = 1.4;
    
    // 欧拉角
    eulers = new pc.Vec3();
    
    // 触摸坐标
    touchCoords = new pc.Vec2();
    
    // Raycast 终点实体
    rayEnd: pc.Entity | null = null;
    
    initialize() {
        // 查找 raycast 终点
        this.rayEnd = this.app.root.findByName('RaycastEndPoint') as pc.Entity;
        
        if (!this.rayEnd) {
            console.warn('⚠️ CameraMovement: 未找到 RaycastEndPoint 实体');
        }
        
        // 监听鼠标事件
        if (this.app.mouse) {
            this.app.mouse.on("mousemove", this.onMouseMove, this);
            this.app.mouse.on("mousedown", this.onMouseDown, this);
        } else {
            console.error('❌ CameraMovement: 鼠标设备不可用');
        }
        
        console.log('✅ CameraMovement 初始化完成');
    }
    
    postUpdate() {
        const originEntity = this.entity.parent;
        
        if (!originEntity) return;
        
        const targetY = this.eulers.x + 180;
        const targetX = this.eulers.y;
        
        const targetAng = new pc.Vec3(-targetX, targetY, 0);
        
        originEntity.setEulerAngles(targetAng);
        
        this.entity.setPosition(this.getWorldPoint());
        
        this.entity.lookAt(originEntity.getPosition());
    }
    
    onMouseMove = (e: pc.MouseEvent) => {
        if (pc.Mouse.isPointerLocked()) {
            this.eulers.x -= ((this.mouseSpeed * e.dx) / 60) % 360;
            this.eulers.y -= ((this.mouseSpeed * e.dy) / 60) % 360;
            
            if (this.eulers.x < 0) this.eulers.x += 360;
            if (this.eulers.y < 0) this.eulers.y += 360;
        }
    };
    
    onMouseDown = () => {
        if (this.app.mouse) {
            this.app.mouse.enablePointerLock();
        }
    };
    
    getWorldPoint(): pc.Vec3 {
        if (!this.entity.parent || !this.rayEnd) {
            return new pc.Vec3();
        }
        
        const from = this.entity.parent.getPosition();
        const to = this.rayEnd.getPosition();
        
        // 执行 raycast
        const hit = this.app.systems.rigidbody?.raycastFirst(from, to);
        
        return hit ? hit.point : to;
    }
    
    destroy() {
        // 清理鼠标事件监听
        if (this.app.mouse) {
            this.app.mouse.off("mousemove", this.onMouseMove, this);
            this.app.mouse.off("mousedown", this.onMouseDown, this);
        }
    }
}
