var speed = 0.05;
var height = 50;

var fs = require('fs');

var subtitles = fs.readFileSync('subtitles.json', 'utf8');
subtitles = JSON.parse(subtitles);

var timeline = [];
var id = 0;
var lastY = 0;

var html = subtitles.map(function (line) {
	var y = line[0]/speed;
	if (y < lastY + height) y = lastY + height;
	lastY = y;

	var html = line[2];
	html = '<p style="top:'+y+'px" id="st'+id+'">'+html+'</p>';

	timeline.push({begin:line[0]*1000, end:line[1]*1000, id:id, y:y});
	id++;

	return html;
})

for (var i = 1; i < timeline.length-1; i++) {
	var i0 = i-1;
	var i1 = i+1;
	timeline[i].speed = (timeline[i1].y-timeline[i0].y)/(timeline[i1].end-timeline[i0].end);
}
timeline[0].speed = 0;
timeline[timeline.length-1].speed = 0;

timeline = JSON.stringify(timeline, null, '\t');
timeline = timeline.replace(/[\" ]/g, '');

html = [
	'<!DOCTYPE html>',
	'<html lang="de">',
		'<head>',
			'<meta charset="utf-8">',
			'<meta name="viewport" content="width=320, initial-scale=1.0">',
			'<title>Quarks &amp; Co: Inklusion - Behindertes Lernen?</title>',
			'<link href="assets/main.css" rel="stylesheet">',
			'<script src="assets/jquery-2.0.3.min.js"></script>',
			'<script src="assets/main.js"></script>',
			'<script>',
				'var timeline = '+timeline+';',
			'</script>',
		'</head>',
		'<body>',
			'<div id="content">',
				'<div id="videoContainer">',
					'<video id="video" width="320" height="184" controls autoplay>',
						//'<source src="quarks_inklusion.mp4" type="video/mp4">',
						'<source src="http://http-ras.wdr.de/CMS2010/mdb/ondemand/weltweit/fsk0/30/306935/306935_3042091.mp4" type="video/mp4">',
						'Your browser does not support the video tag.',
					'</video>',
				'</div>',
				'<div id="subtitleWrapper">',
					'<div id="subtitles" style="height:'+(lastY+100)+'px">',
						html.join('\n'),
					'</div>',
				'</div>',
			'</div>',
		'</body>',
	'</html>'
].join('\n');

fs.writeFileSync('../index.html', html, 'utf8');
