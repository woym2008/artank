/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );
	this.q = this.object.quaternion.clone();

	this.enabled = true;

	this.deviceOrientation = {};
	this.savedDeviceOrientation = null;
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians

	var onDeviceOrientationChangeEvent = function ( event ) {

		if(!scope.savedDeviceOrientation) scope.savedDeviceOrientation = event;

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

		var q3 = new THREE.Quaternion();

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			q3.setFromEuler( euler ); // orient the device

			//q3.multiply( q1 ); // camera looks out the back of the device, not the top

			q3.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

			q3.premultiply(q);

			quaternion.copy(q3);

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

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
			//setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
			setObjectQuaternion( scope.object.quaternion, dA, dB, dG, orient );

		}


	};

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};
