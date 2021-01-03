#### 框架目录/

- 策划文档/
    - 游戏策划相关

- 文档/
    - 框架说明/ 框架相关文档
    - 日志/ 项目日志
    - 项目/ 项目相关，比如说项目进度
    - 其他文件为一些工具提示文件，比如说推荐安装的VsCode常用插件，和一些工具的简单使用说明

- bin/
    - libs/项目所依赖的库文件，需要在bin/index.js里面引入
    - res/ 项目资源目录，项目所有资源均在这个目录下
        - atlas/ laya的资源目录
        - config/ 从doc表中打包出来的json文件目录
        - export/ 从unity中打包出来的预制体和场景目录
        - FGUI/ 从FGUI中打包出来的文件
        - LvConfig/ 从untiy中打包出的关卡json文件
        - url/ 项目自定义需要的资源，比如音效，皮肤，还有其他的一些资源

- libs/ 
    - TS依赖的包文件

- Unity3D/ unity3D 项目
    - 版本必须为 **2018.4.7f1**
    - 负责制作游戏场景
    - Assets/Scenes 目录
        - export场景 负责导出根节点关卡和关卡加载的其他3d资源会和关卡资源一起加载，名字和配置表关卡列表名字一一对应
        - prefabs场景 负责导出预制体，关卡中的所有物体均有预制体摆成,任何修改的东西只能通过修改预制体体现出来
    - Assets/prefabes 目录
        - 预制体目录，所有的预制体和预制体相关的材质，动画都放这个目录下
    - Assets/GameBag 目录
        - 游戏原包资源和其他资源
    - 相关操作
        - 根据(GameObject/ExportPrefabsNameToTs)导出当前场景(必须是export场景)预制体名字列表TS文件
        - 根据(GameObject/ExportLevelJson)导出场景配置JSON文件
        - 根据(LayaAir3D/)导出预制体文件
        - 根据(LTGame/Config/Progress Save Paht)导出配置文件

- gameFairy/ FGUI 项目
    - 负责做制作游戏的 UI
    - 最好用这个 fgui 社区版打开
        - git: https://gitee.com/yayaluoya/laya-box-use-fgui
    - GameBag 包
        - 游戏原包 ui，不导出，也不能使用，如果要使用请复制到对应包中
    - InitEmptyScreen 包
        - 白屏时使用的包，就是一张图片或者什么都没有
    - InitLoad 包
        - 游戏初始化前加载的包，越小越好
    - GameMain 包
        - 游戏主包
    - GameCommon 包
        - 游戏公共资源包
    - 相关操作
        - 直接发布就会自动发布fgui包和ts代码文件

- doc/
    - 所有配置文件
    在 unity 中导出成相关 json 文件和代码
    文档采用驼峰命名法比如 a_b_c
    数据类型与 C#数据类型保持一致
    int,float,boolean,string
      - 注意！： 配置文件中不能有空的东西，不然会报莫名奇妙的错误
    - 文件说明
      - LevelConfig [必要文件] 框架会依赖这个文件加载初始化节点资源，可以多个节点一起，用逗号隔开，比如 scene_debug,scene_1 就会把scene_debug,scene_1这两个节点加载并构建出来
      - EnvironmentConfig 环境配置参数
      - CameraConst 摄像机配置参数
      - LightingConst 灯光配置参数
      - GameConst 游戏主要参数
      - GameStateConst //
      - SkinConfig 皮肤配置
      - TestConst 测试配置


- ShortRes/
    - 临时目录,只有.keep文件会被跟踪，其他文件不会被git跟踪

- src/ 项目代码目录
    - aTGame/ 为框架目录   
        - 3d/ 3D场景相关，加载场景资源和构建场景，销毁场景
          - Material/ 一些常用材质相关
          - 3DAnimantion/ 3D动画相关，播放动画的类可以从这里继承
        - UI/ UI相关
          - FGUI/ FGUI界面工具和管理
          - BaseUI/ FGUI相关基类
        - Async/ 强制同步工具
        - Commom/ 公共类
        - Config/ 配置文件处理类，所有配置文件数据代理均从这里继承
        - Data/ 本地数据保存类重这里继承
        - Func/ 一些工具
        - Main/ 框架加载和管理器
        - Manager/ 管理器
        - Net/ 发送请求
        - Physics/ 物理相关
        - Platform_/ 平台相关
        - Res/ 相关资源目录
        - Root/ 一些在框架之上的东西 
        - Tconst/ 项目相关工具常量
        - test/ 测试相关
        - utils/ 一些常用工具
    - bTGameConfig/ 放项目中框架和项目都依赖的配置文件
    - cFrameBridge/ 放框架依赖的项目文件
      - 框架依赖的关卡配置数据，会通过这个获取关卡节点名字和其他信息
    - dMyGame/ 项目文件
        - _config/ untiy打包出的配置文件ts文件！内容全是自动生成的，不要修改
        - _refabsName/ unity自动导出的场景预制体列表文件，包括预制体分类
        - $PrefabProcessor/ 场景相关预制体批量处理，项目合适就使用，不合适就不用，重写写一套即可
          - 可以批量修改和分类场景中的所有预制体，并统一添加脚本
        - common/ 公共内容
        - configProxy/ 配置文件数据代理
        - control/ 控制器
        - enum/ 常用的枚举文件
        - EventEnum/ 事件枚举文件
        - GameData/ 游戏相关数据保存，必须在在GameLoad中预先加载
          - GameDataSave 游戏主要保存数据
          - GamePropDataSave 游戏道具数据
          - GameSkinDataSave 游戏皮肤数据
          - GameSignDataSave 游戏签到数据
          - GameShortDataSave 游戏临时数据
        - Main/ 游戏主入口
        - manager/ 一些管理器
        - Physics/ 物理相关
        - proxy/ 相关代理，代理本地数据和音效处理
        - ResList/ 资源列表，比如说预制体资源列表，音效资源列表（会预加载）
        - UIMediator/ UI调度者，管理对于的FGUI目录下的UI界面，建议注册到manager/UiManager.ts文件中，然后由UIManagerProxy.ts文件代理设置
            - 每个UI调度者都有一个调度的UI界面，在FGUI/下，而且需要设置层级，默认为EUILayer.Panel，各个层级显示顺序在aTGame/FGUI/EUILayer.ts中
    - FGUI 目录放fgui打包文件，配合UIMediator打开或关闭, 也可以由aTGame/FGUI/FGuiRootManager.ts打开，由FGUI自动导出，不要修改
    - OIMO 目录放的是OIMO物理库文件
        - 需要使用的话必须在index.js文件引入库文件，而且在bTGameConfig/MainGameConfig.ts文件中设置开启才行，使用AddOimo.ts配合OimoManager.ts使用

####  代码流程
  - Main.ts Laya入口文件
  -  dMyGame/ 
     -  MainStart.ts 项目入口文件
     -  Main/
        -  GameLoad.ts 加载资源，UI包，配置表，音效，其它资源
     -  Game/
        -  Game2D.ts 2D游戏入口
        -  Game3D.ts 3D游戏入口
           - Manager/ 初始化相关管理器
             - UIManager.ts UI管理器，注册所有UI调度者
             - CustomsManager.ts 关卡管理器，监听关卡构建和销毁事件然后构建相应关卡和销毁当前关卡
               - 场景构建完毕，场景所有预制体，游戏开始
  - 最重要的关卡加载和构建流程
    - 在unity中导出场景配置JSON文件(方法上面有);
    - 通过SceneManager.instance.getSceneByLv()方法获取场景，这个方法会把LevelConfig中配置的场景节点列表在unity中导出场景配置JSON文件中找到对应节点并返回场景对象，然后通过场景对象的buildScene方法就可以构建场景了，游戏结束的时候再通过clearScene方法清除场景就可以了，通过场景对象的prefabs属性可以获取改场景中的所有物体列表，并根据预制体分类 

#### 其他目录均为 layaAir 目录

#### 使用流程
    第一次使用先以此点击NPM脚本中的 install-layaair2-cmd，install-gulp 安装相关包，然后点击 layaair2-cmd-auto-compile 打开服务并监听文件变化自动编译，完成后按F5打开浏览器，复制终端里面的主页链接打开游戏主页然后就可以了