class App {
    constructor(url = '') {
        this.clientEndUrl = '';
        // 摄像头设置参数请查看： https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
        // 预置打开摄像头的参数
        this.cameras = [
            { label: '默认摄像头', value: { audio: false, video: true } },
            { label: '前置摄像头', value: { audio: false, video: { facingMode: { exact: 'user' } } } },
            { label: '后置摄像头', value: { audio: false, video: { facingMode: { exact: 'environment' } } } }
        ];
        // 识别成功后的回调
        this.callback = null;
        this.clientEndUrl = url || 'https://cn1-crs.easyar.com:8443/search';
        //this.listCamera();
        var controlsBtn= document.getElementById("controlBtn");
        controlsBtn.addEventListener("touchend", function(event){
        	window.DeviceOrientationEvent.requestPermission()
        	.then(state => {
        		switch(state){
        			case "granted":
        			//window.addEventLisitener('deviceorientation', capture_orientation, false);
        			window.addEventLisitener('deviceorientation', function(event){
        				var rotateDegrees = event.alpha;
					        // gamma: 从左到右
					        var leftToRight = event.gamma;
					        // beta: 从前到后的运动
					        var selfbeta = event.beta;
					        if(selfbeta > 180)
					        {
					        	selfbeta = 360-event.beta;
					        }
					        var frontToBack = selfbeta;
					
					        handleOrientationEvent(0, 0, 0);
        				
        				}, true);
        			break;
        			case "denied":
        			alert("cancle device!!")
        			case "prompt":
        			break;
        			}
        		});
        	}, true);

        
        this.initEvent();
    }
    /**
     * 初始化WebAR对象
     * @param token 认证token
     */
    setToken(token) {
        this.webAR = new WebAR(1000, this.clientEndUrl, token, document.querySelector('#easyAR'));
    }
    /**
     * 使用集成方法获取tolen及初始化WebAR对象
     */
    useEasyAr() {
        // expire：有效期（秒）
        fetch('/webar/token?expire=86400', {
            method: 'POST',
        }).then(res => res.json()).then(data => {
            return data.statusCode === 0 ? Promise.resolve(data) : Promise.reject(data.result);
        }).catch(err => {
            console.info(err);
            alert(`获取token失败\n${err}`);
        }).then(data => {
            this.setToken(data.result);
        });
    }
    listCamera() {
        this.cameraElement = document.querySelector('#videoDevice');
        this.cameras.forEach((item, index) => this.cameraElement.appendChild(new Option(item.label, `${index}`)));
    }
    show(target) {
        document.querySelector(`#${target}`).classList.remove('none');
    }
    hide(target) {
        document.querySelector(`#${target}`).classList.add('none');
    }
    /**
     * 尝试打开摄像头
     * @param p 摄像头参数
     */
    openCamera(p) {
        let self = this;
        this.stopRecognize();
        this.webAR.openCamera(p).then(() => {
            //this.show('start');
            window.setTimeout(self.startScan(),2000);
        }).catch(err => {
            console.error(err);
            alert(`摄像头打开失败\n${err}`);
        });
    }
    
    /**直接打开摄像头 */
    directOpenCamera(){
        this.openCamera(this.cameras[2].value);
        /*
        window.DeviceOrientationEvent.requestPermission()
        	.then(state => {
        		switch(state){
        			case "granted":
        			window.addEventLisitener('deviceorientation', capture_orientation, false);
        			break;
        			case "denied":
        			alert("cancle device!!")
        			case "prompt":
        			break;
        			}
        		});*/
    }
    switchControl(){

        isDeviceing = true;
        //开启陀螺仪
        $("#controlBtn").removeClass("controlIconae").addClass("controlIcon");
        
        window.DeviceOrientationEvent.requestPermission().then(state => {
        	console.log('state',state)
        	switch(state){
        		case "granted":
        				window.addEventListener('deviceorientation', capture_orientation, false);
        			break;
        			case "denied":
        				alert("you cancle");
        			break;
        			case "prompt":
        				alert("other");
        			break
        	}
        	
        });
    }
    startScan(){
        this.show('scanLine');
        //this.hide('start');
        //this.show('stop');
        this.webAR.startRecognize((msg) => {
            this.stopRecognize();
            //this.show('start');
            if (this.callback) {
                this.callback(msg);
            }
        })
    }

    initEvent() {
        // 打开设备上的摄像头
        /*
        document.querySelector('#openCamera').addEventListener('click', () => {
            this.openCamera(this.cameras[this.cameraElement.value].value);
        });
        // 开启识别
        document.querySelector('#start').addEventListener('click', () => {
            // todo: 清除已渲染的内容(视业务需求)

            this.show('scanLine');
            this.hide('start');
            this.show('stop');
            this.webAR.startRecognize((msg) => {
                this.stopRecognize();
                this.show('start');
                if (this.callback) {
                    this.callback(msg);
                }
            });
        }, false);
        // 暂停识别
        document.querySelector('#stop').addEventListener('click', () => {
            this.stopRecognize();
            this.show('start');
        }, false);*/
    }
    stopRecognize() {
        this.hide('scanLine');
        //this.hide('stop');
        this.webAR.stopRecognize();
    }
}
//# sourceMappingURL=app.js.map