class ThreeHelper {
    constructor() {
        this.muzzle = null;
        this.framePlayer = null;
        this.mixers = [];
        this.scene = new THREE.Scene();
        this.scene.add(     new THREE.AmbientLight(0xFFFFFF)  );
        var l1 = new THREE.DirectionalLight( 0xffffff, 10 );
        l1.position.set(-5,10,0);
        l1.rotation.set(45,175,0);
        this.scene.add(l1);
        var l2 = new THREE.DirectionalLight( 0xffffff, 10 );
        l2.position.set(5,-10,0);
        l2.rotation.set(145,45,0);
        this.scene.add(l2);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.rotation.set(0,-0.35,0);
        this.camera.position.set(-61.41, -10.65, 236.75);
        
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
        this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.control.update();

        
        this.render();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }
        if(this.framePlayer){
            this.framePlayer.update();
        }
        
				if(this.dControls)
        {
        	this.dControls.update();
        }
        window.requestAnimationFrame(() => {
            this.render();
        });
    }
    loadObject(setting, callback) {
        const loader = new THREE.FBXLoader();
        var self = this;
        loader.load(setting.model, (object) => {
            object.scale.setScalar(setting.scale);
            object.position.set(setting.position[0], setting.position[1], setting.position[1]-115);
            this.scene.add(object);
            
            this.dControls = new THREE.DeviceOrientationControls(object);
            
            this.muzzle = object.getObjectByName("muzzle");

            if(this.muzzle){
                //alert("Find TANK muzzle!")
                this.createPartical();
            }

            if (object.animations.length > 0) {
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                let anima = object.mixer.clipAction(object.animations[0]);
                object.mixer.addEventListener( 'finished', function( e ) {
                     /*alert("TANK Anima Finish!")*/
                     self.framePlayer.sprite.visible  = true;
                     self.framePlayer.play();
                    } );
                anima.clampWhenFinished = true;
                anima.setLoop(THREE.LoopOnce);
                anima.play();
            }
        }, (p) => {
            if (p.loaded) {
                callback({ loaded: p.loaded, total: p.total });
            }
        });
    }
    createPartical(){

        this.framePlayer = new Frame(
            { src: 'asset/images/boom.png', width: 2048, height: 1024, fWidth: 128, fHeight: 128, count: 128 }, 
            { width: 128, height: 128, duration: 2.33333, loop: false }
        );
        //sprite.position.set(this.muzzle.position.x, this.muzzle.position.y, this.muzzle.position.z );

        this.framePlayer.sprite.position.set(0, 0, 0 );
        this.framePlayer.sprite.scale.set(5, 5, 5 );
        this.scene.add(this.framePlayer.sprite);
        this.muzzle.add(this.framePlayer.sprite);
        this.framePlayer.sprite.visible  = false;
        //this.muzzle.scale.set(5, 5, 5 );


    }
}
//# sourceMappingURL=ThreeHelper.js.map