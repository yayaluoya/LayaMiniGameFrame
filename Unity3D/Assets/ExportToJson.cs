using UnityEngine;
using System.Collections;
using UnityEditor;
using System.Collections.Generic;
using System.Xml;
using System.IO;
using System.Text;
using LitJson;
using System.Text.RegularExpressions;

namespace JsonEditor
{
    public class ExportToJson : Editor
    {

        //导出预制体名字到ts文件 
        [MenuItem("GameObject/ExportPrefabsNameToTs")]
        static void ExportPrefabsNameToTs()
        {
            string sceneName = ExportToJson.capitalizeFirstSetter(UnityEngine.SceneManagement.SceneManager.GetActiveScene().name);
            //预制体名字ts文件导出目录
            string filepath = @".\..\src\dMyGame\_prefabsName\_" + sceneName + "PrefabNames.ts";
            //
            createFile(filepath);
            //
            string prefabsNames = "";
            List<string> names = new List<string>();
            Object[] objAll = UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects();
            GameObject[] gos = (GameObject[])FindObjectsOfType(typeof(GameObject));
            string classText = "";
            List<string> classList = new List<string>();
            Regex classReg = new Regex("(^{ *class *(?<name>[a-zA-Z0-9]*) *(?<log>.*))");
            bool ifClass = false;
            Match classMatch = classReg.Match("");
            for (int i = 0; i < objAll.Length; i++)
            {
                GameObject obj = objAll[i] as GameObject;
                string name = obj.name;
                //判断是不是预制体
                if (!ExportToJson.IsPrefabAsset(obj, true))
                {
                    //检测是不是分类
                    if ((new Regex("^{")).IsMatch(name))
                    {
                        // 获取这个分类名字
                        classMatch = classReg.Match(name);
                        ifClass = true;
                    }
                    //分类结束
                    else if ((new Regex("^}")).IsMatch(name))
                    {
                        ifClass = false;
                        classText += "\n";
                        classText += "    /**\n";
                        classText += "    * " + classMatch.Groups["log"] + "\n";
                        classText += "    */\n";
                        classText += "    public static get Get" + ExportToJson.capitalizeFirstSetter(classMatch.Groups["name"].ToString()) + "Class(): string[] {\n";
                        classText += "        //返回数据\n";
                        classText += "        return [\n";
                        if (classList.Count > 0)
                        {
                            //添加进分组数据
                            for (int j = 0; j < classList.Count; j++)
                            {
                                classText += ("            '" + classList[j] + "',\n");
                            }
                            //
                        }
                        classText += "        ];\n";
                        classText += "    }\n";
                        //清空
                        classList = new List<string>();
                    }
                    else
                    {
                        prefabsNames += ("    //" + name + "\n");
                    }
                    continue;
                }
                //判断是否检测到一个分类
                if (ifClass)
                {
                    classList.Add(name);
                }
                //
                names.Add(name);
                //
                string _name = ExportToJson.capitalizeFirstSetter(name.Replace(" ", ""));
                prefabsNames += ("    public static readonly " + _name + ": string = '" + name + "';" + "\n");
            }
            //
            string _prefabeNameTest = "";
            for (int i = 0; i < names.Count; i++)
            {
                _prefabeNameTest = _prefabeNameTest + "@" + names[i] + "@";
            }
            // Debug.Log(_prefabeNameTest);
            //读取本地缓存各个场景预制体列表
            string _AllPrefabsNameCacheURL = @"./Assets/Cache/AllPrefabsNameCache.txt";
            string _AllPrefabsNameCacheText = "";
            try{
                string[] _AllPrefabsNameCache = File.ReadAllLines(_AllPrefabsNameCacheURL);
                for (int i = 0; i < _AllPrefabsNameCache.Length; i++)
                {
                    _AllPrefabsNameCacheText += _AllPrefabsNameCache[i];
                }
            }catch{}
            // Debug.Log(_AllPrefabsNameCacheText);
            Regex _AllPrefabsNameCacheSceneRegex = new Regex("@"+sceneName+":{.*?}");
            string _cacheSceneText = "@"+sceneName+":{"+_prefabeNameTest+"}";
            //替换场景预制体列表
            if(_AllPrefabsNameCacheSceneRegex.IsMatch(_AllPrefabsNameCacheText)){
                _AllPrefabsNameCacheText = _AllPrefabsNameCacheSceneRegex.Replace(_AllPrefabsNameCacheText, _cacheSceneText);
            }
            else{
                _AllPrefabsNameCacheText += _cacheSceneText;
            }
            // Debug.Log(_AllPrefabsNameCacheText);
            //存储缓存
            createFile(_AllPrefabsNameCacheURL);
            File.WriteAllText(_AllPrefabsNameCacheURL, _AllPrefabsNameCacheText);
            //根据缓存设置一个全局的预制体名字ts脚本
            TextAsset AllPrefabsAsset = (TextAsset)Resources.Load("template/AllPrefabsNames"); 
            string AllPrefabsTxt = AllPrefabsAsset.text;
            string _AllPrefabsNameSceneText = "";
            //读取所有预制体名字
            MatchCollection _allPrefabeMatch = (new Regex("@(?<scene>.*?):{(?<prefabs>.*?)}")).Matches(_AllPrefabsNameCacheText);
            for (int i = 0; i < _allPrefabeMatch.Count;i++ )
            {
                _AllPrefabsNameSceneText = _AllPrefabsNameSceneText+ "    " + _allPrefabeMatch[i].Groups["scene"]+": string = '"+_allPrefabeMatch[i].Groups["prefabs"]+"';\n";
            }
            //
            AllPrefabsTxt = (new Regex("{{AllPrefab}}")).Replace(AllPrefabsTxt, _AllPrefabsNameSceneText);
            string _AllPrefabsNameSceneURL = @".\..\src\dMyGame\_prefabsName\_AllPrefabNames.ts";
            //写入全部预制体名字
            File.WriteAllText(_AllPrefabsNameSceneURL, AllPrefabsTxt);
            //读取模板
            TextAsset textAsset = (TextAsset)Resources.Load("template/PrefabsName");
            string template = textAsset.text;
            //正则替换模板内容
            string text = (new Regex("{{PrefabNames}}")).Replace(template, prefabsNames);
            text = (new Regex("{{sceneName}}")).Replace(text, sceneName);
            text = (new Regex("{{className}}")).Replace(text, classText);
            //写入文件
            File.WriteAllText(filepath, text);
            //
            AssetDatabase.Refresh();
            //打印输出
            Debug.Log("导出场景 " + sceneName + " 预制体名字TS文件完成，时间：" + System.DateTime.Now);
        }

        //导出关卡配置json文件
        [MenuItem("GameObject/ExportLevelJson")]
        static void ExportJSON()
        {
            string sceneName = UnityEngine.SceneManagement.SceneManager.GetActiveScene().name;
            //关卡配置json文件导出目录
            string filepath = @".\..\bin\res\LvConfig\" + sceneName + ".json";
            //filepath = @"C:\Users\EDZ\Desktop\LayaAir3D\huabingnvhai\New Unity Project\Assets\level.json";
            createFile(filepath);
            Object[] objAll = UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects();
            GameObject[] gos = (GameObject[])FindObjectsOfType(typeof(GameObject));
            List<GameObject> allPrefab = new List<GameObject>();
            for (int i = 0; i < objAll.Length; i++)
            {
                GameObject obj = objAll[i] as GameObject;
                if (!obj.activeSelf)
                    continue;
                // if (obj.GetComponent<Light>() != null)
                //     continue;
                allPrefab.Add(obj);
            }

            Dictionary<string, List<Child>> childDic = new Dictionary<string, List<Child>>();
            List<Child> child = new List<Child>();
            foreach (var item in allPrefab)
            {
                if (!item.activeSelf)
                    continue;
                child.Add(SetChild(item.transform, (item.GetComponent<Camera>() != null), (item.GetComponent<Light>() != null)));
            }
            childDic.Add("root", child);
            string text = JsonMapper.ToJson(childDic);
            //去除空属性
            text = (new Regex(",\"position\":null")).Replace(text, "");
            text = (new Regex(",\"euler\":null")).Replace(text, "");
            text = (new Regex(",\"scale\":null")).Replace(text, "");
            text = (new Regex(",\"child\":null")).Replace(text, "");
            text = (new Regex(",\"prefabName\":null")).Replace(text, "");
            //压缩
            // text = Lis2013HISWSTest.ZipHelper.GetStringByDataset(text);
            //
            File.WriteAllText(filepath, text);
            //
            AssetDatabase.Refresh();
            //打印输出
            Debug.Log("导出场景 " + sceneName + " 关卡JSON文件完成，时间：" + System.DateTime.Now);
        }

        //字符串首字母转大写
        public static string capitalizeFirstSetter(string str)
        {
            return str.Substring(0, 1).ToUpper() + str.Substring(1);
        }

        public static Child SetChild(Transform tmp, bool camera = false, bool light = false)
        {
            Vector3 pos = tmp.localPosition;
            Vector3 rot = tmp.localRotation.eulerAngles;
            Vector3 scale = tmp.localScale;
            Child child = new Child();
            child.SetNode(tmp);
            child.name = tmp.name;
            //去掉首尾空格
            child.name = (new Regex(" *")).Replace(child.name, "");
            child.SetPos(pos);
            child.SetEulerAngles(rot);
            child.SetScale(scale);
            if (camera)
            {
                child.SetCameraLightEulerAngles(rot);
                child.name = "camera";
            }
            if (light)
            {
                child.SetCameraLightEulerAngles(rot);
                child.name = "light";
            }
            //
            return child;
        }

        static void createFile(string filepath)
        {
            FileInfo t = new FileInfo(filepath);
            Debug.Log(filepath);
            if (!File.Exists(filepath))
            {
                File.Delete(filepath);
            }
        }

        public static bool IsPrefabAsset(UnityEngine.Object obj, bool includePrefabInstance)
        {
#if UNITY_EDITOR
            if (!obj)
            {
                return false;
            }

            var type = UnityEditor.PrefabUtility.GetPrefabAssetType(obj);
            if (type == UnityEditor.PrefabAssetType.NotAPrefab)
            {
                return false;
            }

            var status = UnityEditor.PrefabUtility.GetPrefabInstanceStatus(obj);
            if (status != UnityEditor.PrefabInstanceStatus.NotAPrefab && !includePrefabInstance)
            {
                return false;
            }

            return true;
#else
        return false;
#endif
        }
    }

    public class Child
    {
        private Transform nodeTran;
        public string name;
        public string prefabName;

        public string position;

        public string euler;

        public string scale;
        public List<Child> child;

        public void SetNode(Transform node)
        {
            if (ExportToJson.IsPrefabAsset(node, true))
            {
                string path = PrefabUtility.GetPrefabAssetPathOfNearestInstanceRoot(node);
                GameObject go = AssetDatabase.LoadAssetAtPath<GameObject>(path);
                prefabName = go.name;
                return;
            }
            nodeTran = node;
            for (int i = 0; i < nodeTran.childCount; i++)
            {
                Transform tmp = nodeTran.GetChild(i);
                if (child == null)
                {
                    child = new List<Child>();
                }
                child.Add(ExportToJson.SetChild(tmp));
            }
        }

        public void SetPos(Vector3 pos)
        {
            if (pos.x == 0 && pos.y == 0 && pos.z == 0)
            {
                this.position = null;
            }
            else
            {
                this.position = (-pos.x) + "," + pos.y + "," + pos.z;
            }
        }

        public void SetEulerAngles(Vector3 euler)
        {
            if (euler.x == 0 && euler.y == 0 && euler.z == 0)
            {
                this.euler = null;
            }
            else
            {
                this.euler = euler.x + "," + (-euler.y) + "," + (-euler.z);
            }
        }

        public void SetScale(Vector3 scale)
        {
            if (scale.x == 1 && scale.y == 1 && scale.z == 1)
            {
                this.scale = null;
            }
            else
            {
                this.scale = scale.x + "," + scale.y + "," + scale.z;
            }
        }

        //设置相机和灯光的旋转
        public void SetCameraLightEulerAngles(Vector3 euler)
        {
            this.euler = (-euler.x) + "," + (180 - euler.y) + "," + euler.z;
        }
    }
}
