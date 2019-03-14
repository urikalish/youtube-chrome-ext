
function getVideoStats(id, cb) {
	let urlBase = 'https://www.googleapis.com/youtube/v3/videos?part=statistics';
	let key = 'AIzaSyDC3ZkKLUZ4rhoJbyTGxiD3YKmokimspXU';
	let url = `${urlBase}&id=${id }&key=${key}`;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			try {
				let json = JSON.parse(xhr.response);
				cb(id, json);
			} catch(err) {
			}
		}
	};
	xhr.onerror = function() {
		alert('err');
	};
	xhr.open('GET', url, true);
	xhr.send('');
}

function onVideoStatsDone(id, data) {
	console.log(data);
}
	
setTimeout(function() {
	console.log('YouTubeExt');
	getVideoStats('LsA-1gPV8nY', onVideoStatsDone);	
}, 0);
