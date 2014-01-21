$(function () {
	var time = 0;
	var lastTime = -1;
	var frameDuration = 40;
	var highlightIndex = -1;
	var timeReduceFactor = 1000;

	var container = $('#subtitleWrapper');

	timeline.forEach(function (entry) {
		entry.node = $('#st'+entry.id);
	});

	var video = $('#video').get(0);


	var interval = setInterval(frame, frameDuration);

	function frame() {
		var currentTime = video.currentTime*1000;
		time += frameDuration;

		if (currentTime == lastTime) return;

		var index = findByTime(currentTime);
		var nextIndex = index;

		if ((index < 0) || (index >= timeline.length)) {
			highlight(-1);
		} else {
			var subtitle = timeline[index];
			if ((subtitle.begin <= currentTime) && (subtitle.end >= currentTime)) {
				highlight(index);
			} else {
				highlight(-1);
			}
			if (subtitle.end <= currentTime) nextIndex++;
		}

		var i0 = Math.max(0, Math.min(timeline.length-1, nextIndex-1));
		var i1 = Math.max(0, Math.min(timeline.length-1, nextIndex));
		var duration = (timeline[i1].end - timeline[i0].end + 1e-10);
		var x = (currentTime - timeline[i0].end)/duration;
		x = Math.max(0, Math.min(1, x));

		var f0 = timeline[i0].y;
		var f1 = timeline[i1].y;
		var s0 = timeline[i0].speed*duration;
		var s1 = timeline[i1].speed*duration;

		var a =  2*f0 - 2*f1 +   s0 + s1;
		var b = -3*f0 + 3*f1 - 2*s0 - s1;

		var y = f0 + x*(s0+x*(b+a*x)); // a*x^3 + b*x^2 + s0*x + f0;
		//var y = f0*(1-a) + f1*a;
		container.scrollTop(y);
		//console.log(currentTime+'\t'+y+'\t');

		//if (currentTime >= 16000) clearInterval(interval);

		//$('#video').html([currentTime,i0, i1, a].join(', '));
	}

	function highlight(index) {
		if (highlightIndex == index) return;
		if (highlightIndex >= 0) timeline[highlightIndex].node.removeClass('highlight');
		if (         index >= 0) timeline[         index].node.addClass(   'highlight');
		highlightIndex = index;
	}

	function findByTime(time) {
		for (var i = 0; i < timeline.length; i++) {
			if (timeline[i].begin >= time) {
				return i-1;
			}
		}
		return 1e10;
	}
});

