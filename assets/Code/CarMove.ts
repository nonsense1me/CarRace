// 监听类型如下:
// 鼠标事件 Input.EventType.MOUSE_DOWN
// Input.EventType.MOUSE_MOVE
// Input.EventType.MOUSE_UP
// Input.EventType.MOUSE_WHEEL
//触摸事件 Input.EventType.TOUCH_START
// Input.EventType. TOUCH_MOVE
// Input. EventType. TOUCH_END
// Input. EventType. TOUCH_CANCEL
// 键盘事件 Input.EventType.KEY_DOWN(键盘按下)
// Input.EventType.KEY_PRESSING(键盘持续按下)
// Input.EventType.KEY_UP(键盘释放)

// 监听写法:input.on(监听类型,触发后执行函数,this)
// 监听开启 和 关闭 成对写上(防止内存泄漏)
import { _decorator, Component, Node ,Input,input, Collider, ICollisionEvent, Label, director} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CarMove')
export class CarMove extends Component {
    
    
    
    @property(Label)//导入提示框文本组件
    Tips_Label:Label = null;

    // 控制节点（2D/3D）显示/隐藏/销毁
    @property(Node)//导入提示框父节点
    Tips_Node:Node = null;//销毁节点this.Tips_Node.destroy();this.Tips_Node.active = true;//显示节点


    //监听碰撞的逻辑
    //先获取目标节点的组件
    @property(Node)
    Car_Node:Node = null;//导入赛车自身节点
    @property
    Car_Collider:Collider = null; // 变量 赛车自身节点的碰撞事件 --- 62
    //获取节点下的组件，节点.getComponent(组件类型)
    //监听碰撞触发:组件.on("触发类型"，执行函数，this)
    //监听碰撞触发类型:onTriggerEnter 开始触发
    //监听碰撞触发类型:onTriggerStay 持续触发
    //监听碰撞触发类型:onTriggerExit 结束触发
    
    @property
    Move = true;//移动开关
    




    //先获取该节点位置 this.node.getPosition()
    // 再修改该节点位置 this.node.setPosition(pos.x,pos.y,pos.z-1)
    //this.note 节点自身

    //脚本中绑定节点/组件：@property(类型) 对象名：类型=初始值null
    @property(Node) //导入相机节点
    C_Node:Node = null







    //监听写法 input.on(监听类型，触发后执行函数，this)
    //监听事件 要记得关闭
    protected onLoad():void{//脚本第一个执行的函数，一般用于 开始监听事件
        
        console.log("加载函数执行");
        console.log("节点激活状态:", this.node.active);
        

        input.on(Input.EventType.KEY_DOWN,this.Key_Down,this);
         input.on(Input.EventType.KEY_PRESSING, this.Key_Pressing, this); // 添加这个测试
        input.on(Input.EventType.KEY_UP,this.Key_Up,this);

        this.Car_Collider =this.Car_Node.getComponent(Collider);
        this.Car_Collider.on('onTriggerEnter',this.Start_Collider,this)
    }

    // New_Game(Button,e){//按钮的执行函数 Button按钮的默认参数 e为传的参
    // //重新开始方式1
    // //1.隐藏提示快
    // // 2.初始化赛车位置
    // // 3.初始化相机位置
    // //4.开启移动开关
    //     console.log("重新开始");
    //     this.Tips_Node.active =false;
    //     this.node.setPosition(0.032,0.772,2.679);
    //     this.C_Node.setPosition(0.037,6.913,13.423);//Car_Node
    //     this.Move=true;

    // }
    //重新开始方式2
    New_Game(){
        director.loadScene("scene");//加载场景
    }

    Start_Collider(C){//碰撞后执行函数
        console.log("触发碰撞");
        // this.Tips_Node.destroy();
        this.Tips_Node.active = true;//显示节点
        if(C.otherCollider.node.name =="end"){
            this.Tips_Label.string="成功了";
            console.log("Win!!!!!!!");
        }else{
            this.Tips_Label.string="失败了";
        }
        this.Move =false;

    }


    Key_Pressing(key): void {
    // console.log("按键持续按下:", key.keyCode); // 如果这个有输出，说明键盘监听正常
}

    protected onDestroy():void{
        console.log("销毁函数执行");
        input.off(Input.EventType.KEY_DOWN,this.Key_Down,this);
        input.off(Input.EventType.KEY_UP,this.Key_Up,this);
        this.Car_Collider.off('onTriggerEnter',this.Start_Collider,this);
    }
    Key_Down(key):void{//key为默认参数 是键盘按下的信息
        console.log("监听函数执行");
        if(key.keyCode === 65){
            console.log("按下了A");
            this.Player_Move.a=true;

        }else if(key.keyCode === 68){
             console.log("按下了D");
             this.Player_Move.d=true;
        }
    }
    Key_Up(key):void{
        console.log("监听函数执行");
        if(key.keyCode === 65){
            console.log("抬起了A");
            this.Player_Move.a=false;
        }else if(key.keyCode === 68){
             console.log("抬起了D");
             this.Player_Move.d=false;
        }
    }

    @property //可以使该变量在编辑器界面编辑
    Player_Speed: number = 30;//赛车速度
    @property // 横向移动速度（左右）
    Lateral_Speed: number = 30;
    Player_Move ={
        a:false,
        d:false
    }//控制赛移动
    
    
    start():void {//开始函数，脚本启动执行该函数，自动执行
        console.log(this.Car_Node.getComponent(Collider))
        console.log("脚本启动");
        
    }

    update(deltaTime: number):void {//每一帧（1s=60帧）都会执行 循环函数
        if(!this.Move){return}
        const C_Pos = this.C_Node.getPosition();//获取相机节点位置121


        //deltaTime 每一帧的时间
        // console.log("更新函数执行。。。。");
        // console.log(deltaTime);

        // 获取当前位置
        const Car_Pos = this.node.getPosition()
        // console.log(Car_Pos);
        
        // 计算新位置
        let newX = Car_Pos.x;
        let newZ = Car_Pos.z - deltaTime * this.Player_Speed; // 自动前进
        //由于个别设备帧率忽高忽低，会造成速度不对等，为了防止这样的情况，就需要帧时间补偿
        // this.node.setPosition(pos.x,pos.y,pos.z-0.5)

        if(Car_Pos.x >=2.7){
            Car_Pos.x =2.7;
        }else if(Car_Pos.x <= -2.7){
            Car_Pos.x = -2.7;
        }



        

        // 左右移动逻辑
        if(this.Player_Move.a && !this.Player_Move.d){//往左
            newX = Car_Pos.x - deltaTime * this.Lateral_Speed;
        }else if(this.Player_Move.d && !this.Player_Move.a){
            newX = Car_Pos.x + deltaTime * this.Lateral_Speed;
        }

        
        this.node.setPosition(newX, Car_Pos.y, newZ);
         this.C_Node.setPosition(C_Pos.x,C_Pos.y, C_Pos.z-deltaTime*this.Player_Speed);
    }
    lateUpdate(){//在更新函数执行完后执行
        // console.log("延迟函数执行。。。。");
    }
}


