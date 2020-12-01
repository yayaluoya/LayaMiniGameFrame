import { FGUIEx } from '../UI/FGUIEx';
import CommomMcUtils from './CommomMcUtils';
/**
 * McMv
 */
export default class McMv extends FGUIEx.GMovieClip {
    public dispose(clearMcOnce: boolean = true) {
        clearMcOnce && !this._displayObject.destroyed && CommomMcUtils.clearMcTimesByType(this.packName);
        super.dispose();
    }

    public get packName() {
        return this.packageItem.owner.name;
    }
}