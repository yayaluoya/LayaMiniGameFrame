#### 框架日记
    -
    1. RootClassProxy 通过继承这个类代理数据解决循环依赖问题
    2. git 会自动忽略掉一些文件，导致拉取时文件丢失，在忽略列表里禁止掉就行了
    3. 微信小游戏不支持async和await语法糖，如果使用则会在微信打开时黑屏，需要自己写promise.then()回调实现
       1. new Promise<void>((r) => { r();});//一个promise的时候
       2. Promise.all([]).then();//多个promise的时候
    4. laya分包
       1. 在game.json中添加"subpackages": [
                {
                "name": "",
                "root": "/"
                }
            ]
        2. 然后把要分包资源拖到bin/目录下