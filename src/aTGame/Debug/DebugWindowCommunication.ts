/**
 * 窗口通信
 */
export default class DebugWindowCommunication {
    /** 消息列表 */
    private m_mesList: {
        this: string,
        key: string,
        f: (_data: any) => void,
    }[] = [];

    /**
     * 添加一个消息
     * @param _this 执行域 
     * @param _key 关键字
     * @param _f 回调方法
     */
    public onMes(_this: any, _key: string, _f: (_data: any) => void) {
        this.m_mesList.push({
            this: _this,
            key: _key,
            f: _f,
        });
    }

    /**
     * 发送一个消息
     */
    public eventMes(_key: string, ..._data: any[]) {
        //遍历整个消息列表
        this.m_mesList.forEach((item) => {
            if (item.key == _key) {
                item.f.call(item.this, ..._data);
            }
        });
    }

    /**
     * 删除消息
     * @param _key 键值
     */
    public removeMes(_this: any, _key?: string) {
        this.m_mesList = this.m_mesList.filter((item) => {
            if (typeof _key != "undefined") {
                return item.this != _this && item.key != _key;
            } else {
                return item.this != _this;
            }
        });
    }
}