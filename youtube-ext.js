
console.log('YouTubeExt');

setTimeout(function() {
	getAllVideosData();
}, 5000);

function getAllVideosData() {
	let elms = document.querySelectorAll('div#items.ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer');
	for (let i = 0; i < elms.length; i++) {
		let videoId = elms[i].querySelector('a#thumbnail').getAttribute('href').substring(9);
		getSingleVideoData(videoId);	
	}		
}

function getSingleVideoData(id) {
	let urlBase = 'https://www.googleapis.com/youtube/v3/videos';
	let key = 'AIzaSyDC3ZkKLUZ4rhoJbyTGxiD3YKmokimspXU';
	let url = `${urlBase}?part=statistics&id=${id}&key=${key}`;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			let data = JSON.parse(xhr.response);
			handleVideoData(data);			
		}
	};
	xhr.onerror = function() {console.log(`error on httpGet() - ${err}`);};
	xhr.open('GET', url, true);
	xhr.send('');	
}

function handleVideoData(data) {
	let id = data.items[0].id;
	let stats = data.items[0].statistics;
	let videoData = {
		viewCount: stats.viewCount,
		likeCount: stats.likeCount,
		dislikeCount: stats.dislikeCount,
		favoriteCount: stats.favoriteCount,
		commentCount: stats.commentCount
	}
	console.log(`${id} - ${videoData.viewCount}`);
}
