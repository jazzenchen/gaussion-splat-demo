import * as pc from 'playcanvas';
import { CameraMovement } from './camera-movement';

export class AvatarMovement extends pc.Script {
  // 移动速度
  speed = 0.02;

  // 相机引用
  cameraEntity: pc.Entity | null = null;

  // 临时变量，避免垃圾回收
  worldDirection = new pc.Vec3();
  tempDirection = new pc.Vec3();

  //
  cameraScript: CameraMovement | null = null;

  // 动画组件
  animComponent: pc.AnimComponent | null = null;

  initialize() {
    // 查找相机实体
    this.cameraEntity = this.app.root.findByName('Camera') as pc.Entity;

    if (!this.cameraEntity) {
      console.error('❌ AvatarMovement: 未找到相机实体');
    } else {
      console.log('✅ AvatarMovement: 相机已找到');
      this.cameraScript = this.cameraEntity.script?.get('cameraMovement') as unknown as CameraMovement || null;
    }
  }

  update(dt: number) {

    if (!this.cameraEntity || !this.app.keyboard) return;

    // 延迟获取动画组件
    if (!this.animComponent) {
      this.animComponent = this.entity.anim as pc.AnimComponent;
    }

    // 重置方向
    this.worldDirection.set(0, 0, 0);

    const forward = this.entity.forward;
    const right = this.entity.right;

    let x = 0;
    let z = 0;

    // 检测按键输入
    if (this.app.keyboard.isPressed(pc.KEY_A)) {
      x += 1;
    }

    if (this.app.keyboard.isPressed(pc.KEY_D)) {
      x -= 1;
    }

    if (this.app.keyboard.isPressed(pc.KEY_W)) {
      z -= 1;
    }

    if (this.app.keyboard.isPressed(pc.KEY_S)) {
      z += 1;
    }


    if (x !== 0 || z !== 0) {
      this.worldDirection.add(this.tempDirection.copy(forward).mulScalar(z));
      this.worldDirection.add(this.tempDirection.copy(right).mulScalar(x));
      this.worldDirection.normalize();

      const pos = new pc.Vec3(this.worldDirection.x * dt, 0, this.worldDirection.z * dt);
      pos.normalize().mulScalar(this.speed);
      pos.add(this.entity.getPosition());

      if (this.cameraScript) {
        const targetY = this.cameraScript?.eulers.x + 180;
        const rot = new pc.Vec3(0, targetY, 0);

        // 使用 rigidbody 的 teleport（如果有物理组件）
        if (this.entity.rigidbody) {
          this.entity.rigidbody.teleport(pos, rot);
        } else {
          // 否则直接设置位置和旋转
          this.entity.setPosition(pos);
          this.entity.setEulerAngles(rot);
        }
      }
    }



    // // 如果有输入，处理移动
    // if (x !== 0 || z !== 0) {
    //   // 计算世界方向
    //   this.worldDirection.add(this.tempDirection.copy(forward).mulScalar(z));
    //   this.worldDirection.add(this.tempDirection.copy(right).mulScalar(x));
    //   this.worldDirection.normalize();

    //   // 计算新位置
    //   const pos = new pc.Vec3(
    //     this.worldDirection.x * dt,
    //     0,
    //     this.worldDirection.z * dt
    //   );
    //   pos.normalize().mulScalar(this.speed);
    //   pos.add(this.entity.getPosition());

    //   // 计算朝向（基于相机旋转）
    //   const cameraEulers = this.cameraEntity.getEulerAngles();
    //   const targetY = cameraEulers.x + 180;
    //   const rot = new pc.Vec3(0, targetY, 0);


    // }

    // 更新动画参数（如果有动画组件）
    // if (this.animComponent) {
    //   this.animComponent.setFloat('xDirection', x);
    //   this.animComponent.setFloat('zDirection', z);
    // }
  }
}
