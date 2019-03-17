
console.log('YouTubeChromeExt');

var videosData = {};

function observeDOM(obj, cb){
	let obs = new MutationObserver((mutations) => {
	if (mutations[0].addedNodes.length || mutations[0].removedNodes.length )
		cb();
	});
	obs.observe(
		obj,
		{
			childList: true,
			subtree:true
		}
	);
}

setTimeout(function() {
	getAllVideosData();
	observeDOM(document.querySelector('div#items.ytd-watch-next-secondary-results-renderer'), () => {
		getAllVideosData();
	});
}, 5000);

function getAllVideosData() {
	let elms = document.querySelectorAll('div#items.ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer');
	for (let i = 0; i < elms.length; i++) {
		let videoId = elms[i].querySelector('a#thumbnail').getAttribute('href').substring(9);
		if (!videosData[videoId]) {
			videosData[videoId] = {
				id: videoId,
				parentDomElm: elms[i]
			};
			getVideoData(videoId);
		}
	}		
}

function getVideoData(id) {
	try {
		let xhr = new XMLHttpRequest();	
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				let data = JSON.parse(xhr.response);
				handleVideoData(data);			
			}
		};
		xhr.onerror = () => {
			console.log(`error on getVideoData() - ${err}`);
		};
		let url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&key=AIzaSyDC3ZkKLUZ4rhoJbyTGxiD3YKmokimspXU&id=${id}`;
		xhr.open('GET', url, true);
		xhr.send('');	
	} catch(err) {
		console.log(`error on getVideoData() - ${err}`)	
	}
}

function handleVideoData(data) {
	if (data && data.items && data.items[0]) {
		let id = data.items[0].id;
		let stats = data.items[0].statistics;
		let videoData = videosData[id];
		videoData.viewCount = stats.viewCount;
		videoData.likeCount = stats.likeCount;
		videoData.dislikeCount = stats.dislikeCount;
		videoData.favoriteCount = stats.favoriteCount;
		videoData.commentCount = stats.commentCount;
		updateDom(videoData);
	} else {
		console.log(`error on handleVideoData() - missing data object`)
	}
}

function updateDom(videoData) {
	let dataElm = document.createElement('div');
	dataElm.classList.add('youtube-chrome-ext--data');

	let likeDislikeElm = document.createElement('div');
	likeDislikeElm.classList.add('youtube-chrome-ext--like-dislike');

	let likeElm = document.createElement('div');
	likeElm.classList.add('youtube-chrome-ext--like');
	likeElm.style['flex'] = `${videoData.likeCount} 0 0px`;
	
	let dislikeElm = document.createElement('div');
	dislikeElm.classList.add('youtube-chrome-ext--dislike');
	dislikeElm.style['flex'] = `${videoData.dislikeCount} 0 0px`;

	likeDislikeElm.appendChild(likeElm);
	likeDislikeElm.appendChild(dislikeElm);

	let commentsElm = document.createElement('div');
	commentsElm.textContent = `${videoData.commentCount} comments`;
	commentsElm.classList.add('youtube-chrome-ext--comment-count');

	dataElm.appendChild(likeDislikeElm);
	dataElm.appendChild(commentsElm);

	let infoElm = videoData.parentDomElm.querySelector('ytd-thumbnail + div > a.yt-simple-endpoint');
	infoElm.appendChild(dataElm);
}
