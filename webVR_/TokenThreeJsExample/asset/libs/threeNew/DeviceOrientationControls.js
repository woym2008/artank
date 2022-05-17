/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

 THREE.DeviceOrientationControls = function ( object , camera) {

	var scope = this;

	this.object = object;
	//this.object.rotation.reorder( 'YXZ' );

	this.q = this.object.quaternion.clone();

	this.camera = camera;

	this.enabled = true;

	this.deviceOrientation = {};
	this.savedDeviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = -1.57; // radians

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q = scope.q;

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;
		var savedDevice = scope.savedDeviceOrientation;

		if ( device ) {

			var alpha = device.alpha ? THREE.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

			var beta = device.beta ? THREE.Math.degToRad( device.beta ) : 0; // X'

			var gamma = device.gamma ? THREE.Math.degToRad( device.gamma ) : 0; // Y''

			var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

			
			var dA = savedDevice ? (savedDevice.alpha ? alpha - THREE.Math.degToRad(savedDevice.alpha) : 0) : alpha;
			var dB = savedDevice ? (savedDevice.beta ? beta - THREE.Math.degToRad(savedDevice.beta) : 0) : beta;
			var dG = savedDevice ? (savedDevice.gamma ? gamma - THREE.Math.degToRad(savedDevice.gamma) : 0) : gamma;
			
			//console.log(dA +',' + dB + ',' + dG);
			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
			//setObjectQuaternion( scope.object.quaternion, dA, dB, dG, orient );

			//
			if(	scope.savedDeviceOrientation){
				scope.savedDeviceOrientation.alpha = device.alpha;
				scope.savedDeviceOrientation.beta = device.beta;
				scope.savedDeviceOrientation.gamma = device.gamma;
		   	}
			
			//计算object
			/*
			this.camera.dummy.position.set(0,0,0);
			this.camera.dummy.lookAt(this.camera.getWorldDirection + this.camera.position);
			this.camera.dummy.updateMatrix();*/

			
			var zee = new THREE.Vector3( 0, 0, 1 );
			var euler = new THREE.Euler();
			var q0 = new THREE.Quaternion();
			var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis
			var q2 = new THREE.Quaternion();
			//euler.set( dB, dA, - dG, 'YXZ');
			euler.set( dB, dA, - dG, 'XYZ');
			q2.setFromEuler(euler);
			//q2.multiply(q1);
			q2.multiply( q0.setFromAxisAngle( zee, - orient ) );
			//scope.object.quaternion.multiply(q2);

		}


	};

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};