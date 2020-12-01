/**
 * 压缩工具
 */
export class ZlibUtils {
    /**
     * 压缩 二进制数据
     * @param bytes 
     * @returns Array.<number> or Uint8Array
     */
    public static compressBytes(bytes: Laya.Byte): any {
        var byte8 = new Uint8Array(bytes.buffer);
        var defate = new Zlib.Deflate(byte8);
        var compressed = defate.compress();
        return compressed;
    }

    /**
     * 解压 二进制数据
     * @param compressed  Array.<number> or Uint8Array
     */
    public static uncompressBytes(compressed: any): Laya.Byte {
        var inflate = new Zlib.Inflate(compressed);
        var plain = inflate.decompress();

        var plainByte: Laya.Byte = new Laya.Byte(plain);
        return plainByte;
    }

    /**
     * 压缩字符串
     * @param _string 字符串 
     */
    public static compressString(_string: string) {
        var defate = new Zlib.Deflate(_string);
        var compressed = defate.compress();
        return compressed;
    }
}