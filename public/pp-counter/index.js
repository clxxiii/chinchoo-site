let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

socket.onopen = () => console.log("Successfully Connected");

socket.onclose = (event) => {
	console.log("Socket Closed Connection: ", event);
	socket.send("Client Closed!");
};

socket.onerror = (error) => console.log("Socket Error: ", error);

let chinRef = document.getElementById("chin-ref");
let bgs = document.getElementsByClassName("bg");
let overlay = document.getElementById("overlay");
let error = document.getElementById("error");
let metadata = document.getElementById("metadata");
let metadataString = document.getElementById("metadata-string");
let metadataMapId = document.getElementById("metadata-map-id");
let metadataMap = document.getElementById("metadata-map");
let metadataStars = document.getElementById("metadata-stars");
let metadataCSAR = document.getElementById("metadata-csar");
let metadataODHP = document.getElementById("metadata-odhp");
let metadataBPM = document.getElementById("metadata-bpm");
let ur = document.getElementById("UR");
let hits = document.getElementById("hits");
let hits0 = document.getElementById("hits0");
let hits50 = document.getElementById("hits50");
let hits100 = document.getElementById("hits100");
let ppBox = document.getElementById("pp");
let ppString = document.getElementById("pp-string");
let grade = document.getElementById("grade");
let gradeText = document.getElementById("grade-text");

let statesEnum = {
	0: "MainMenu",
	1: "EditingMap",
	2: "Playing",
	3: "GameShutdownAnimation",
	4: "SongSelectEdit",
	5: "SongSelect",
	6: "WIP_NoIdeaWhatThisIs",
	7: "ResultsScreen",
	10: "GameStartupAnimation",
	11: "MultiplayerRooms",
	12: "MultiplayerRoom",
	13: "MultiplayerSongSelect",
	14: "MultiplayerResultsscreen",
	15: "OsuDirect",
	17: "RankingTagCoop",
	18: "RankingTeam",
	19: "ProcessingBeatmaps",
	22: "Tourney",
};

let urCount = new CountUp("UR", 0, 0, 2, 1, {
	decimalPlaces: 2,
	useEasing: true,
	useGrouping: false,
	separator: " ",
	decimal: ".",
});

let temp = {
	state: null,
	bg: null,
	id: null,
	sr: null,
	ur: null,
	hits: {
		0: null,
		50: null,
		100: null,
	},
	pp: null,
	rank: null,
};

let od = new Odometer({
	el: metadataMapId,
	value: 1000000,
	format: "d",
});

let pp = new Odometer({
	el: ppString,
	value: 0,
	format: "(d).dd",
});
socket.onerror = () => {
	overlay.style.opacity = 0;
	error.style.opacity = 1;
};

socket.onmessage = (event) => {
	try {
		overlay.style.opacity = 1;
		error.style.opacity = 0;
		let data = JSON.parse(event.data);
		if (temp.id != data.menu.bm.id) {
			temp.id = data.menu.bm.id;
			let { artist, title, difficulty } = data.menu.bm.metadata;
			metadataString.textContent = `${artist} - ${title} [${difficulty}]`;

			metadataMapId.textContent = temp.id;
			if (metadataString.getBoundingClientRect().width >= 290) {
				metadataString.classList.add("over");
			} else {
				metadataString.classList.remove("over");
			}
		}

		if (
			temp.sr != data.menu.bm.stats.fullSR ||
			temp.id != data.menu.bm.id
		) {
			temp.sr = data.menu.bm.stats.fullSR;
			let { CS, AR, OD, HP, fullSR, BPM } = data.menu.bm.stats;

			metadataStars.textContent = `${fullSR.toFixed(2)}☆`;
			metadataCSAR.textContent = `CS${CS.toFixed(1)} AR${AR.toFixed(1)}`;
			metadataODHP.textContent = `OD${OD.toFixed(1)} HP${HP.toFixed(1)}`;
			metadataBPM.textContent = `BPM: ${BPM.max}`;
		}

		if (temp.bg != data.menu.bm.path.full) {
			temp.bg = data.menu.bm.path.full;
			let img = data.menu.bm.path.full
				.replace(/#/g, "%23")
				.replace(/%/g, "%25");
			for (const bg of bgs) {
				bg.setAttribute(
					"src",
					`http://127.0.0.1:24050/Songs/${img}?a=${Math.random(
						10000
					)}`
				);
			}
		}

		if (
			temp.ur != data.gameplay.hits.unstableRate &&
			data.menu.state == 2
		) {
			temp.ur = data.gameplay.hits.unstableRate;
			urCount.update(data.gameplay.hits.unstableRate);
		}

		if (temp.hits[0] != data.gameplay.hits[0]) {
			temp.hits[0] = data.gameplay.hits[0];
			hits0.textContent = temp.hits[0];
		}

		if (temp.hits[50] != data.gameplay.hits[50]) {
			temp.hits[50] = data.gameplay.hits[50];
			hits50.textContent = temp.hits[50];
		}

		if (temp.hits[100] != data.gameplay.hits[100]) {
			temp.hits[100] = data.gameplay.hits[100];
			hits100.textContent = temp.hits[100];
		}

		if (temp.pp != data.gameplay.pp.current && data.menu.state == 2) {
			temp.pp = data.gameplay.pp.current;
			ppString.textContent = data.gameplay.pp.current;
		}

		if (temp.rank != data.gameplay.hits.grade.current) {
			temp.rank = data.gameplay.hits.grade.current;
			if (
				data.menu.mods.str.includes("HD") ||
				data.menu.mods.str.includes("FL")
			) {
				hdfl = true;
			} else hdfl = false;

			if (data.gameplay.hits.grade.current === "") {
				gradeText.textContent = "SS";
			} else gradeText.textContent = data.gameplay.hits.grade.current;

			if (gradeText.textContent == "SS") {
				if (hdfl == true) {
					gradeText.style.color = "#E4E4E4";
				} else {
					gradeText.style.color = "#FFFB8B";
				}
			} else if (gradeText.textContent == "S") {
				if (hdfl == true) {
					gradeText.style.color = "#E4E4E4";
				} else {
					gradeText.style.color = "#FFFB8B";
				}
			} else if (gradeText.textContent == "A") {
				gradeText.style.color = "#9DF9AA";
			} else if (gradeText.textContent == "B") {
				gradeText.style.color = "#9DACF9";
			} else if (gradeText.textContent == "C") {
				gradeText.style.color = "#ED9DF9";
			} else {
				gradeText.style.color = "#F99D9D";
			}
		}

		if (temp.state != data.menu.state) {
			// If the user goes to the results screen
			if (temp.state == 5 && data.menu.state == 7) {
				return;
			}
			temp.state = data.menu.state;
			if (chinRef) {
				chinRef.setAttribute(
					"src",
					`./overlays/${statesEnum[temp.state]}.jpg`
				);
			}

			if (temp.state == 5 || temp.state == 13) {
				setTimeout(() => {
					metadata.style.width = "150px";
				}, 500);
				metadata.style.height = "40px";
				metadataString.classList.remove("over");
			} else {
				setTimeout(() => {
					metadata.style.height = "160px";
				}, 500);
				metadata.style.width = "310px";
			}

			if (temp.state == 7 || temp.state == 14) {
				ppBox.style.transform = "translateY(0px) scale(1.3)";
				grade.style.transform = "translateX(-200px)";
				hits.style.transform = "translateY(125px)";
				ur.style.transform = "translateY(0px)";
				ppBox.style.color = "#AAFFAA";
			} else if (temp.state == 2) {
				ppBox.style.transform = "translateY(0px) scale(1)";
				grade.style.transform = "translateX(0px)";
				hits.style.transform = "translateY(0px)";
				ur.style.transform = "translateY(0px)";
				ppBox.style.color = "#FFFFFF";
			} else {
				ppBox.style.transform = "translateY(-125px) scale(1)";
				grade.style.transform = "translateX(-200px)";
				hits.style.transform = "translateY(125px)";
				ur.style.transform = "translateY(125px)";
				ppBox.style.color = "#FFFFFF";
			}
		}
	} catch (err) {
		console.log(err);
	}
};
