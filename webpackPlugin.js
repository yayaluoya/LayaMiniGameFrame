/** 
 * webpack插件
 */
class webpackPlugin {
    apply(resolver) {
        //        
        if (!resolver.fileSystem) {
            console.log(1);
        }
        // getHook will only exist in Webpack 4, if so we should comply to the Webpack 4 plugin system.
        if (resolver.getHook && typeof resolver.getHook === "function") {
            console.log(2);
        }
        else {
            resolver.plugin('', () => {
                console.log(3);
            });
        }
    }
}

//
module.exports = webpackPlugin;