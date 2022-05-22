class ThreeHelper {	    
    constructor() {
        this.tank = null;
        this.tankAnimaPlayer = null;
        this.muzzle = null;
        this.fogAnchor = null;
        this.framePlayer = null;
        this.fbxLoader = null;
        this.mixers = [];
        this.scene = new THREE.Scene();
        this.scene.add(     new THREE.AmbientLight(0xFFFFFF)  );
        var l1 = new THREE.DirectionalLight( 0xffffff, 3.3 );
        l1.position.set(-5,10,0);
        l1.rotation.set(45,175,0);
        this.scene.add(l1);
        var l2 = new THREE.DirectionalLight( 0xffffff, 3.3 );
        l2.position.set(5,-10,0);
        l2.rotation.set(145,45,0);
        this.scene.add(l2);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));   
        //this.camera.rotation.set(-1.0,0,0);
        this.camera.position.set(0.0, -1.379, 100.347);

        this.camera.dummy = new THREE.Object3D();
        this.camera.add(this.camera.dummy);
        //this.camera.far = 10000;
       
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.setAttribute('class', 'easyARCanvas');
        document.body.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.mixers = [];
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
        //this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement , new THREE.Vector3(0,0,157));
        //this.control.update();
        
        this.deltaT = 0;

        
        this.render();
    }

    render() {
    	self = this;	
    	this.deltaT = this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
        for (const mixer of this.mixers) {
            mixer.update(this.deltaT);
        }
        if(this.framePlayer){
            this.framePlayer.update();
        }
        if(this.dControls){
        	this.dControls.update();
        }
        if(this.fogAnchor)
        {   
        	if(this.clock)
        	{
                const time = Date.now() / 1000;
                this.fogAnchor.rotation.z = time * 1.0;
        	}
        }
        if(this.fbxLoader && this.tankAnimaPlayer){
            if(this.fbxLoader.isLoadedAllTexture() && !this.tankAnimaPlayer.enabled  ){
                this.tankAnimaPlayer.enabled = true;
                this.tankAnimaPlayer.play();
                this.tank.visible = true;
/*
                setTimeout(() => {
                    this.fogAnchor.visible = false;
                }, 2000);*/
                
                
                setTimeout(() => {
                	if(this.wordsp)
                    this.wordsp.visible = true;
                    
                    this.wordsp.scale.set(0.01,0.01,0.01);
                    this.ScaleWord();
                }, 5000);
            }
        }

        if( this.fbxLoader && this.tank != null &&
            !document.querySelector('#loadingWrap').classList.contains('none')){
            const val = Math.ceil(this.fbxLoader.getLoadedImgCount());  //total is 16;
            document.querySelector('#loadingPercent').innerHTML = (val + 84) + '%';
            if (val >= 16) {
                document.querySelector('#loadingWrap').classList.add('none');
            }
        }

		  
        window.requestAnimationFrame(() => {
            this.render();
        });
        //console.log(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    }

    loadObject(setting, callback) {
        //const loader = new THREE.FBXLoader();
        var self = this;
        new THREE.TextureLoader().load('asset/images/boom.png', (texobj) =>{
        	var cp = callback;
        	
        	this.fbxLoader = new THREE.FBXLoader();
	        this.fbxLoader.load(setting.model, (object) => {
	            this.tank = object;
	            object.scale.setScalar(setting.scale);
	            //object.position.set(setting.position[0], setting.position[1], setting.position[2]);
	            object.visible = false;
	            this.scene.add(object);
	            object.position.set(0, 21, -3000);
	            this.muzzle = object.getObjectByName("muzzle");
	            this.fogAnchor = object.getObjectByName("fog");
	            this.dControls = new THREE.DeviceOrientationControls(object/*,this.camera*/);        
	            this.dControls.enabled = false;
	            // var switchBtn= document.getElementById("changeTank");
	            // switchBtn.addEventListener("touchend", function(event){
	
	            //     if(self.tank){
	            //         self.tank.scale.set(self.tank.scale.x,self.tank.scale.y,-self.tank.scale.z);
	            //     }
	                
	            // });
	            
	
	            object.children.forEach(function ( child )
	            {
	            	if(child.material)
		            {
		            	//mesh.material = THREE.MeshPhongMaterial();
		            	child.material.metalness = 0.5;
		            	child.material.roughness = 0.5;
		            }
	            });
	            
	            
							/*
	            var controlsBtn= document.getElementById("controlBtn");
	            controlsBtn.addEventListener("touchend", function(event){
	                if(self.dControls.enabled){
	                    console.log("Orientation device already launched!!");
	                    return;
	                }
	                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	                    console.info("IOS About···");
	                    window.DeviceOrientationEvent.requestPermission()
	                    .then(state => 
	                        {
	                        switch(state){
	                            case "granted":{
	                                    console.log("launch Orientation device!!");
	                                    self.dControls.enabled = true;
	                                    window.addEventLisitener('deviceorientation', capture_orientation, false);                                
	                                }
	                            break;
	                            case "denied":
	                                console.log("cancle Orientation device!!");
	                            case "prompt":
	                            break;
	                            }
	                        });
	                }
	                else{
	                    console.info("Android Or Others");
	                    let r = confirm("是否启动陀螺仪?")
	                    if (r){
	                        self.dControls.enabled = true;
	                        console.log("launch Orientation device!!");
	                    }
	                    else{
	                        console.log("cancle Orientation device!!");
	                    }
	                }
	
	                }, true);*/
	
	            if(this.muzzle){
	                //alert("Find TANK muzzle!")
	                this.createPartical();
	            }
	            
	            if(this.fogAnchor){
	                this.CreateSmoke();
	                
	                this.CreateWord();
	            }
	            
	            this.tank.visible = true;

	            
	            this.MoveTank(function()
	            {
	            	var mself = self;
	            	var funcself = this;
	            	
	            	//close fog
								mself.fogAnchor.visible = false;
	            	
	            	//boom
	            	mself.framePlayer.sprite.visible  = true;
								mself.framePlayer.play();
									
									setTimeout(() => {
	                            //mself.framePlayer.sprite.visible  = true;
	                            //mself.framePlayer.play();
	                            
	                            if (mself.tank.animations.length > 0) {
			                mself.tank.mixer = new THREE.AnimationMixer(mself.tank);
			                mself.mixers.push(mself.tank.mixer);
			                let anima = mself.tank.mixer.clipAction(mself.tank.animations[0]);
			                mself.tankAnimaPlayer = anima;
			                
			                mself.framePlayer.sprite.visible  = true;
											mself.framePlayer.play();
			                     /*       
			                mself.tank.mixer.addEventListener( 'finished', function( e ) {
			                        setTimeout(() => {
			                            mself.framePlayer.sprite.visible  = true;
			                            mself.framePlayer.play();
			                        }, 1100);
			                     
			                    } );*/
			                anima.clampWhenFinished = true;
			                anima.setLoop(THREE.LoopOnce);
			                anima.enabled = false;
			                /*
			                anima.play();
			                setTimeout(() => {
			                    self.fogAnchor.visible = false;
			                }, 2000);
			                */
			            	}
			            	
									}, 2100);
	                        
	            	
	            	
							}
	            
	            );
	
	            
	            
	            
		        }, (p) => {
		            if (p.loaded) {
		                cp({ loaded: p.loaded, total: p.total });
		            }
	        	});
        	
        	
        },(tp)=>{
        	
        	var cp = callback;
        	
        	if(tp.loaded)
        	{
        	this.fbxLoader = new THREE.FBXLoader();
	        this.fbxLoader.load(setting.model, (object) => {
	            this.tank = object;
	            object.scale.setScalar(setting.scale);
	            //object.position.set(setting.position[0], setting.position[1], setting.position[2]);
	            object.visible = false;
	            this.scene.add(object);
	            this.muzzle = object.getObjectByName("muzzle");
	            this.fogAnchor = object.getObjectByName("fog");
	            this.dControls = new THREE.DeviceOrientationControls(object/*,this.camera*/);        
	            this.dControls.enabled = false;
	            // var switchBtn= document.getElementById("changeTank");
	            // switchBtn.addEventListener("touchend", function(event){
	
	            //     if(self.tank){
	            //         self.tank.scale.set(self.tank.scale.x,self.tank.scale.y,-self.tank.scale.z);
	            //     }
	                
	            // });
	            
	
	            object.children.forEach(function ( child )
	            {
	            	if(child.material)
		            {
		            	//mesh.material = THREE.MeshPhongMaterial();
		            	child.material.metalness = 0.5;
		            	child.material.roughness = 0.5;
		            }
	            });
	            
	            
							/*
	            var controlsBtn= document.getElementById("controlBtn");
	            controlsBtn.addEventListener("touchend", function(event){
	                if(self.dControls.enabled){
	                    console.log("Orientation device already launched!!");
	                    return;
	                }
	                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	                    console.info("IOS About···");
	                    window.DeviceOrientationEvent.requestPermission()
	                    .then(state => 
	                        {
	                        switch(state){
	                            case "granted":{
	                                    console.log("launch Orientation device!!");
	                                    self.dControls.enabled = true;
	                                    window.addEventLisitener('deviceorientation', capture_orientation, false);                                
	                                }
	                            break;
	                            case "denied":
	                                console.log("cancle Orientation device!!");
	                            case "prompt":
	                            break;
	                            }
	                        });
	                }
	                else{
	                    console.info("Android Or Others");
	                    let r = confirm("是否启动陀螺仪?")
	                    if (r){
	                        self.dControls.enabled = true;
	                        console.log("launch Orientation device!!");
	                    }
	                    else{
	                        console.log("cancle Orientation device!!");
	                    }
	                }
	
	                }, true);*/
	
	            if(this.muzzle){
	                //alert("Find TANK muzzle!")
	                this.createPartical();
	            }
	            
	            if(this.fogAnchor){
	                this.CreateSmoke();
	                
	                this.CreateWord();
	            }
	
	            if (object.animations.length > 0) {
	                object.mixer = new THREE.AnimationMixer(object);
	                this.mixers.push(object.mixer);
	                let anima = object.mixer.clipAction(object.animations[0]);
	                self.tankAnimaPlayer = anima;
	                object.mixer.addEventListener( 'finished', function( e ) {
	                        setTimeout(() => {
	                            self.framePlayer.sprite.visible  = true;
	                            self.framePlayer.play();
	                        }, 1100);
	                     
	                    } );
	                anima.clampWhenFinished = true;
	                anima.setLoop(THREE.LoopOnce);
	                anima.enabled = false;
	                /*
	                anima.play();
	                setTimeout(() => {
	                    self.fogAnchor.visible = false;
	                }, 2000);
	                */
	            }
		        }, (p) => {
		            if (p.loaded) {
		                cp({ loaded: p.loaded, total: p.total });
		            }
	        	});
	        }
        	});
        
        
        
                
    }
    
    MoveTank(finhishcallback)
    {
    	var self = this;
    	var cb = finhishcallback;
    	
    	if(self.tank.position.z < 0)
    	{
    		var offsetz = self.tank.position.z + self.deltaT*500;

	    	self.tank.position.set(self.tank.position.x,self.tank.position.y,offsetz);
	    	
	    	window.requestAnimationFrame(()=> {
	            self.MoveTank(finhishcallback);
            });
			}
			else
			{
            self.tank.position.set(self.tank.position.x,self.tank.position.y,0);	
            finhishcallback();
			}

		}
		
    createPartical(){
        var self = this;
        this.framePlayer = new Frame(
            { src: 'asset/images/boom.png', width: 2048, height: 1024, fWidth: 128, fHeight: 128, count: 128 }, 
            { width: 128, height: 128, duration: 2.33333, loop: false },
            function(){
                setTimeout(() => {
                    self.framePlayer.play(true);
                }, 5000);
            }
        );
        this.framePlayer.sprite.position.set(0, 0, 0 );
        this.framePlayer.sprite.scale.set(5, 5, 5 );
        this.framePlayer.sprite.visible  = false;
        this.muzzle.add(this.framePlayer.sprite);
    }
    
    CreateSmoke(){
    	var self = this;
    	var particle = null;
        
			self.smokeParticles = [];
			const loader2 = new THREE.TextureLoader();

			loader2.crossOrigin = '';
				
			loader2.load(
				  //'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82015/blue-smoke.png',
				  'asset/images/smoke.png',

				  (texture) => {
				    const smokeGeo = new THREE.PlaneBufferGeometry(250, 250);
				
				    const smokeMaterial = new THREE.SpriteMaterial({
				      map: texture , color:0xb1a56c});
				
				    for (let p = 0, l = 25; p < l; p++) {
				    	
                        //particle = new THREE.Mesh(smokeGeo, smokeMaterial);

                        particle = new THREE.Sprite(smokeMaterial);
                        particle.geometry = smokeGeo;

                                        
                        particle.position.set(
                        Math.random() * 250 - 150,
                        Math.random() * 250 - 100,
                        Math.random() * 500 - 250);

                        particle.rotation.set(29.6, 0 , Math.random() * 360 );

                        this.fogAnchor.add(particle);

                        self.smokeParticles.push(particle);
				      
				    }
						//self.smokeMaterial.visible = false;
				  });
    	}
    	
    CreateWord()
    {
    	var self = this;
    	
    	const loaderword = new THREE.TextureLoader(); 
    	
    	loaderword.load('asset/images/welcome.png',
				  (texture) => {
				  	
				    const word = new THREE.PlaneBufferGeometry(64, 8);
				
				    const wordMaterial = new THREE.SpriteMaterial({
				      map: texture , color:0xffffff});
				      
				      self.wordsp = new THREE.Sprite(wordMaterial);
				      self.wordsp.geometry = word;
				      
				      self.wordsp.position.set(
                        0,-22,0);
                        
							self.scene.add(self.wordsp);
							
							self.wordsp.visible = false;
				
						//self.smokeMaterial.visible = false;
						
				  });
				  
    	}
    	
    ScaleWord()
    {
    	var self = this;
    	
    	if(this.wordsp.scale.x < 1)
    	{
				var newcsale = this.wordsp.scale.x * (1 + this.deltaT)*1.2;
	    	this.wordsp.scale.set(newcsale,newcsale,newcsale);
	    	
	    	window.requestAnimationFrame(()=> {
	            self.ScaleWord();
            });
        }
        else
        {
            self.wordsp.scale.set(1,1,1);	
        }

		}
}