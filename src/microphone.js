function microphone(constraints, connected, denied, error) {
	navigator.getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

	error = error || function (err) {
		console.error(err);
	};

	const isSupported = Boolean(navigator.getUserMedia);
	const api = {};
	let stream = null;

	function onConnect(micStream) {
		stream = micStream;
		connected(stream);
	}

	function onError(e) {
		if (denied && e.name === 'PermissionDeniedError' || e === 'PERMISSION_DENIED') {
			denied();
		} else {
			error(e.message || e);
		}
	}

	function connect() {
		if (!isSupported) {
			return api;
		}

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia(constraints).then(onConnect).catch(onError);
		} else {
			navigator.getUserMedia(constraints, onConnect, onError);
		}

		return api;
	}

	function disconnect() {
		if (stream.stop) {
			stream.stop();
		} else {
			stream.getAudioTracks()[0].stop();
		}

		stream = null;
		return api;
	}

	return Object.assign(api, {
		connect,
		disconnect,
		isSupported,
		get stream() {
			return stream;
		}
	});
}

export default microphone;
