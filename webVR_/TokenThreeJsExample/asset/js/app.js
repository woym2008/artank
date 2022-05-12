// 请从开者中心获取 "Client-end (Target Recognition) URL"，格式如：https://af0c1ca3b41857bd8d6b44d480601c74.cn1.crs.easyar.com:8443/search
const app = new App('https://59b56126c8fd5d68df2dbca358cd9423.cn1.crs.easyar.com:8443/search');
// 如果使用自定义方法获取token
app.setToken({
    'crsAppId': '7aeff94012d8beee1f1a54f76201ac39',
    'token': 'b3K0qN1quJtxTBRaeqIdafKokomuxZuYMCJWWP/FjbGl8IFGA74Le8DNCZLLst11HNiNbEXhgOjHCeoMVbdBsXvmj0qmkfbffBcthPqD/yTsqEEg7RAvm7vSn5tfn3FFMhPaln9/yYG1wiaw6rLWc+5CMLvX4KI3TWzKMqJsHHhxQe7YfioYHnGflzE66EQ74Jb3c78Nrb8JzAi1gq5vQC6LXLZeISd0ZR+B61T3ZD8xeaxPjAhN3knLyNXY/8+BrGaWmFLfJGzdWEVg6Q7WsYCN5GqQatWoFeUy2LKsEE/OiEjBYYQcnSec/0b9/uRuwALLWYevj9CvmKjiXotvGEBf+NVXqHcOX9xvkEnuJVt4jn+qCqwfREc5HmPcErqMuVVn5hmn10GIxUDZh7ZWQTVb0fpxcGC80LZIjZdBZ3He1UHkovIXzD8l6jBW0/Uyw9DATfxYeNgEwq+7Opudjg==' // APIKey+APISecret生成token
});
// 如果使用EasyAR提供的集成环境
// app.useEasyAr();
// 识别成功后的回调
app.callback = (msg) => {
    console.info(msg);
    const setting = {
        //model: 'asset/model/trex_v3.fbx',ZTZ99A1
        model: 'asset/model/ZTZ99A1_Anima.fbx',
        scale: 0.1,
        position: [0, 0, 0]
    };
    // 可以将 setting 作为meta上传到EasyAR的云识别，使用方法如下:
    // const setting = JSON.parse(window.atob(msg.target.meta));
    showModel(setting);
};
function showModel(setting) {
    const canvas = document.querySelector('.easyARCanvas');
    if (canvas) {
        canvas.remove();
    }
    app.show('loadingWrap');
    // ThreeJS简单使用类
    const threeHelper = new ThreeHelper();
    threeHelper.loadObject(setting, (p) => {
        const val = Math.ceil(p.loaded / p.total * 100);
        document.querySelector('#loadingPercent').innerHTML = `${val}%`;
        if (val >= 100) {
            app.hide('loadingWrap');
        }
    });
}
//# sourceMappingURL=app.js.map