class ThreeHelper {	    
    constructor() {
        this.tank = null;
        //this.tankAnimaPlayer = null;
        this.muzzle = null;
        this.fogAnchor = null;
        this.framePlayer = null;
        this.fbxLoader = null;
		this.tankTotalLoaded = false;
		this.tankMoveable = true;
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
        //this.camera.rotation.set(-1.0,0,0);
        this.camera.position.set(0.0, -23.379, 150.347);
        this.camera.lookAt(new THREE.Vector3(0, -20, 0));   

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
		if(this.tankTotalLoaded){
			this.MoveTank();
		}
		else
		{
			if(this.fbxLoader) {
				this.tankTotalLoaded = this.fbxLoader.isLoadedAllTexture();
				if(this.tankTotalLoaded){
					this.tank.visible = true;
					setTimeout(() => {
						if(this.wordsp)
						this.wordsp.visible = true;
						this.wordsp.scale.set(0.01,0.01,0.01);
						this.ScaleWord();
					}, 5000);
				}
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
        new THREE.TextureLoader().load('asset/images/boom.png', (boomTexture) =>{
        	var cp = callback;       	
        	self.fbxLoader = new THREE.FBXLoader();
	        self.fbxLoader.load(setting.model, (object) => {
	            self.tank = object;
	            self.tank.visible = false;	  
	            object.scale.setScalar(setting.scale);
	            object.visible = false;
	            self.scene.add(object);
	            object.position.set(0, 0, -3000);
	            self.muzzle = object.getObjectByName("muzzle");
	            self.fogAnchor = object.getObjectByName("fog");
	            object.children.forEach(function ( child ){
	            	if(child.material){
		            	child.material.metalness = 0.5;
		            	child.material.roughness = 0.5;
		            }
	            });		
	            if(self.muzzle){
	                self.createPartical(boomTexture);
	            }         
	            if(self.fogAnchor){
	                self.CreateSmoke();	                
	                self.CreateWord();
				}
			}, (p) => {
		            if (p.loaded) {
		                cp({ loaded: p.loaded, total: p.total });
					}
				}
			);       	        	
        });             
    }
    
    MoveTank() {
    	var self = this;  	
		if(!this.tankMoveable) return;
    	if(self.tank.position.z < 0){
    		var offsetz = self.tank.position.z + self.deltaT*1000;
	    	self.tank.position.set(self.tank.position.x,self.tank.position.y,offsetz);
		}
		else
		{
            self.tank.position.set(self.tank.position.x,self.tank.position.y,0);	
            self.fogAnchor.visible = false;	      	
			//boom
			self.framePlayer.sprite.visible  = true;
			self.framePlayer.play();

			setTimeout(() => {
				if (self.tank.animations.length > 0) {
					self.tank.mixer = new THREE.AnimationMixer(self.tank);
					self.mixers.push(self.tank.mixer);
					let anima = self.tank.mixer.clipAction(self.tank.animations[0]);
					//self.tankAnimaPlayer = anima;
					self.framePlayer.sprite.visible  = true;
					self.framePlayer.play();
					anima.clampWhenFinished = true;
					anima.setLoop(THREE.LoopOnce);
					anima.timeScale = 0.2;
					anima.play();
				}
			}, 2000);

			self.tankMoveable = false;
		}
	}
		
    createPartical(imgMap){
        var self = this;
        this.framePlayer = new Frame(
            { /*src: 'asset/images/boom.png',*/ map : imgMap , width: 2048, height: 1024, fWidth: 128, fHeight: 128, count: 128 }, 
            { width: 128, height: 128, duration: 2.33333, loop: false },
            function(){
                setTimeout(() => {
                    self.framePlayer.play(true);
                }, 13000);
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
				  	
				    const word = new THREE.PlaneBufferGeometry(48, 6);
				
				    const wordMaterial = new THREE.SpriteMaterial({
				      map: texture , color:0xffffff});
				      
				      self.wordsp = new THREE.Sprite(wordMaterial);
				      self.wordsp.geometry = word;
				      
				      self.wordsp.position.set(
                        0,-45,0);
                        
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