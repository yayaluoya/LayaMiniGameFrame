import RootLocalStorageData from './RootLocalStorageData';
import MainConfig from '../../bTGameConfig/MainConfig';
import StringUtils from '../Utils/StringUtils';
import Md5 from './Md5';
import RootDataManger from './RootDataManger';
import Base64 from './Base64';
/**
 * 保存本地数据基类
 * 泛型为数据类型
 */
export default abstract class RootLocalStorageSave<T extends RootLocalStorageData> extends RootDataManger {
    /** 获取保存名称 */
    protected abstract get _saveName(): string;

    //获取保存数据的名字
    private get saveName(): string {
        return MainConfig.GameName + this._saveName;
    }

    // 获取对比数据的保存名字
    private get differName(): string {
        //
        return this.encrypt(this.saveName + '-(-__DifferData__LayaMiniGame__-)-');
    }

    /**
     * 保存数据到本地
     */
    protected _SaveToDisk(_saveData: T) {
        let json = JSON.stringify(_saveData);
        Laya.LocalStorage.setJSON(this.saveName, json);
        //判断是否是线上环境
        if (MainConfig.OnLine) {
            //获取对比数据
            let _differJson = this.getDifferData(json);
            //保存对比数据
            Laya.LocalStorage.setJSON(this.differName, _differJson);
        }
    }

    //从本地获取数据
    protected _ReadFromFile(): T {
        let readStr = Laya.LocalStorage.getJSON(this.saveName);
        //判断是否是线上环境
        if (MainConfig.OnLine) {
            //对比数据
            let _differ = Laya.LocalStorage.getJSON(this.differName);
            if (this.getDifferData(readStr) != _differ) {
                return this._saveNewData();
            }
        }
        let _saveData: T = this.getNewData();
        _saveData.versions = undefined;
        //判断数据是否被篡改
        try {
            if (!StringUtils.IsNullOrEmpty(readStr)) {
                let jsonData = JSON.parse(readStr);
                for (let key in jsonData) {
                    _saveData[key] = jsonData[key];
                }
            } else {
                return this._saveNewData();
            }
        }
        catch {
            return this._saveNewData();
        }
        //判断数据版本
        if (_saveData.versions == MainConfig.versions) {
            return _saveData as T;
        } else {
            return this._saveNewData();
        }
    }

    //获取并保存一个新数据
    private _saveNewData(): T {
        let _saveData: T = this.getNewData();
        //设置相关数据
        _saveData.versions = MainConfig.versions;
        _saveData.GameName = MainConfig.GameName;
        _saveData.GameExplain = MainConfig.GameExplain;
        //保存数据
        this._SaveToDisk(_saveData as T);
        //
        return _saveData as T;
    }

    /**
     * 获取一个新的数据
     * 当数据出现问题时会重构数据
     */
    protected abstract getNewData(): T;

    //处理对比数据
    private getDifferData(_string: string): string {
        //判断是否为空
        if (StringUtils.IsNullOrEmpty(_string)) return '';
        //加密
        return this.encrypt(_string);
    }

    //加密
    private encrypt(_string: string) {
        let _encryptStr: string = 'LayaMiniGame' + '-(-' + _string + '-)' + '-ModifiedWithout-' + MainConfig.GameName + '-' + MainConfig.versions;
        //判断能否使用md5
        if (Md5.ifUse) {
            return Md5.hashStr(_encryptStr).toString();
        } else {
            //使用base64
            return Base64.encode(_encryptStr);
        }
    }
}