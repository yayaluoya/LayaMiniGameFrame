import RootTest from "../aTGame/Test/RootTest";

/**
 * 异步测试类
 */
export default class AsyncTest extends RootTest {
    //开始测试
    public startTest() {
        //
        this.asyncTest();
    }

    //
    private async asyncTest() {
        console.log('异步开始。');
        await this._asyncTest();
        console.log('异步结束。');
    }

    //
    private _asyncTest(): Promise<void> {
        return new Promise<void>((_r) => {
            Laya.timer.once(1000, this, () => {
                _r();
            });
        });
    }
}