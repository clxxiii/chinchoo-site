let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let mapid = document.getElementById("mapid");

// NOW PLAYING
let title = document.getElementById("title");
let mapContainer = document.getElementById("mapContainer");
let mapTitle = document.getElementById("mapTitle");
let artistTitle = document.getElementById("mapArtist");
let mapDifficulty = document.getElementById("mapDifficulty");
// CS/OD/AR/HP
let csDisp = document.getElementById("csDisp");
let odDisp = document.getElementById("odDisp");
let arDisp = document.getElementById("arDisp");
let hpDisp = document.getElementById("hpDisp");

// TEAM OVERALL SCORE
let teamRedNames = document.getElementsByClassName("redTeamTitle");
let teamBlueNames = document.getElementsByClassName("blueTeamTitle");
let scoreNowRed = document.getElementById("scoreNowRed");
let scoreNowBlue = document.getElementById("scoreNowBlue");
let scoreMaxRed = document.getElementById("scoreMaxRed");
let scoreMaxBlue = document.getElementById("scoreMaxBlue");

// Player Info Boxes
const players = document.getElementsByClassName("player");
const playerContainer = document.getElementById("player-container");

// For Star Visibility
let scoreRed = document.getElementById("scoreRed");
let scoreBlue = document.getElementById("scoreBlue");
let teamRed = document.getElementById("teamRed");
let teamBlue = document.getElementById("teamBlue");

// TEAM PLAYING SCORE
let playScoreRed = document.getElementById("playScoreRed");
let playScoreBlue = document.getElementById("playScoreBlue");

// Graphic components
let bottom = document.getElementById("bottom");

// Chats
let chats = document.getElementById("chats");
let osuChatText = document.getElementById("osuChatText");

socket.onopen = () => {
	console.log("Successfully Connected");
};

let animation = {
	playScoreRed: new CountUp("playScoreRed", 0, 0, 0, 0.2, {
		useEasing: true,
		useGrouping: true,
		separator: ",",
		decimal: ".",
	}),
	playScoreBlue: new CountUp("playScoreBlue", 0, 0, 0, 0.2, {
		useEasing: true,
		useGrouping: true,
		separator: ",",
		decimal: ".",
	}),
};

socket.onclose = (event) => {
	console.log("Socket Closed Connection: ", event);
	socket.send("Client Closed!");
};

socket.onerror = (error) => {
	console.log("Socket Error: ", error);
};

let bestOfTemp;
let scoreVisibleTemp;
let starsVisibleTemp;

let tempImg;
let tempMapName;
let tempArtistName;
let tempMapDiff;

let tempCS;
let tempOD;
let tempAR;
let tempHP;

let scoreRedTemp;
let pointsRedTemp;
let scoreBlueTemp;
let pointsBlueTemp;
let teamNameRedTemp;
let teamNameBlueTemp;
let gameState;

let player1NameTemp;
let player2NameTemp;
let player3NameTemp;
let player4NameTemp;

let chatLen = 0;
let tempClass = "unknown";

socket.onmessage = (event) => {
	let data = JSON.parse(event.data);
	if (scoreVisibleTemp !== data.tourney.manager.bools.scoreVisible) {
		scoreVisibleTemp = data.tourney.manager.bools.scoreVisible;
		if (scoreVisibleTemp) {
			// Score visible -> Set bg bottom to full
			chats.style.opacity = 0;
			osuChatText.style.opacity = 0;
			playScoreRed.style.opacity = 1;
			playScoreBlue.style.opacity = 1;
			playerContainer.style.transform = "translateY(1000px)";
		} else {
			// Score invisible -> Set bg to show chats
			chats.style.opacity = 1;
			osuChatText.style.opacity = 1;
			playScoreRed.style.opacity = 0;
			playScoreBlue.style.opacity = 0;
			playerContainer.style.transform = "translateY(0px)";
		}
	}
	if (starsVisibleTemp !== data.tourney.manager.bools.starsVisible) {
		starsVisibleTemp = data.tourney.manager.bools.starsVisible;
		if (starsVisibleTemp) {
			scoreRed.style.visibility = "visible";
			scoreBlue.style.visibility = "visible";
			teamRed.style.transform = "translateX(0)";
			teamBlue.style.transform = "translateX(0)";
		} else {
			scoreRed.style.visibility = "hidden";
			scoreBlue.style.visibility = "hidden";
			teamRed.style.transform = "translateX(100px)";
			teamBlue.style.transform = "translateX(-100px)";
		}
	}
	// Update player cards
	if (
		player1NameTemp !== data.tourney.ipcClients[0].spectating.name ||
		player2NameTemp !== data.tourney.ipcClients[1].spectating.name ||
		player3NameTemp !== data.tourney.ipcClients[2].spectating.name ||
		player4NameTemp !== data.tourney.ipcClients[3].spectating.name
	) {
		player1NameTemp = data.tourney.ipcClients[0].spectating.name;
		player2NameTemp = data.tourney.ipcClients[1].spectating.name;
		player3NameTemp = data.tourney.ipcClients[2].spectating.name;
		player4NameTemp = data.tourney.ipcClients[3].spectating.name;

		for (i = 0; i < players.length; i++) {
			let pfp = players[i].getElementsByClassName("profile-pic")[0];
			let username = players[i].getElementsByClassName("username")[0];
			let rank = players[i].getElementsByClassName("rank")[0];

			let pfpUrl =
				"https://s.ppy.sh/a/" + data.tourney.ipcClients[i].spectating.userID;
			let user = data.tourney.ipcClients[i].spectating.name;
			let rankNumber = data.tourney.ipcClients[i].spectating.globalRank;

			players[i].style.visibility = "hidden";
			if (user !== "") {
				players[i].style.visibility = "visible";
			}

			pfp.style.backgroundImage = "url(" + pfpUrl + ")";
			username.innerHTML = user;
			rank.innerHTML = "#" + rankNumber.toLocaleString("en-US");
		}
	}
	if (pointsBlueTemp !== data.tourney.manager.stars.right) {
		pointsBlueTemp = data.tourney.manager.stars.right;
		scoreBlue.innerHTML = pointsBlueTemp;
	}
	if (pointsRedTemp !== data.tourney.manager.stars.left) {
		pointsRedTemp = data.tourney.manager.stars.left;
		scoreRed.innerHTML = pointsRedTemp;
	}
	if (tempImg !== data.menu.bm.path.full) {
		tempImg = data.menu.bm.path.full;
		data.menu.bm.path.full = data.menu.bm.path.full
			.replace(/#/g, "%23")
			.replace(/%/g, "%25")
			.replace(/\\/g, "/");
		mapContainer.style.backgroundImage = `url('http://127.0.0.1:24050/Songs/${
			data.menu.bm.path.full
		}?a=${Math.random(10000)}')`;
	}
	if (tempMapName !== data.menu.bm.metadata.title) {
		tempMapName = data.menu.bm.metadata.title;
		mapTitle.innerHTML = tempMapName;
	}
	if (tempArtistName !== data.menu.bm.metadata.artist) {
		tempArtistName = data.menu.bm.metadata.artist;
		artistTitle.innerHTML = tempArtistName;
	}
	if (teamNameBlueTemp !== data.tourney.manager.teamName.right) {
		teamNameBlueTemp = data.tourney.manager.teamName.right;

		if (teamNameBlueTemp == "") {
			title.innerHTML = "CHINCHOO 2v2";
			for (i = 0; i < teamBlueNames.length; i++) {
				teamBlueNames[i].innerHTML = "Blue Team";
			}
		} else {
			title.innerHTML = "CHINCHOO TOURNAMENT 2";
			for (i = 0; i < teamBlueNames.length; i++) {
				teamBlueNames[i].innerHTML = teamNameBlueTemp;
			}
		}
	}
	if (teamNameRedTemp !== data.tourney.manager.teamName.left) {
		teamNameRedTemp = data.tourney.manager.teamName.left;

		if (teamNameRedTemp == "") {
			for (i = 0; i < teamBlueNames.length; i++) {
				teamRedNames[i].innerHTML = "Red Team";
			}
		} else {
			for (i = 0; i < teamBlueNames.length; i++) {
				teamRedNames[i].innerHTML = teamNameRedTemp;
			}
		}
	}
	if (tempMapDiff !== "[" + data.menu.bm.metadata.difficulty + "]") {
		tempMapDiff = "[" + data.menu.bm.metadata.difficulty + "]";
		mapDifficulty.innerHTML = tempMapDiff;
	}
	if (tempCS !== data.menu.bm.stats.CS) {
		tempCS = data.menu.bm.stats.CS;
		csDisp.innerHTML = tempCS;
	}
	if (tempOD !== data.menu.bm.stats.OD) {
		tempOD = data.menu.bm.stats.OD;
		odDisp.innerHTML = tempOD;
	}
	if (tempAR !== data.menu.bm.stats.AR) {
		tempAR = data.menu.bm.stats.AR;
		arDisp.innerHTML = tempAR;
	}
	if (tempHP !== data.menu.bm.stats.HP) {
		tempHP = data.menu.bm.stats.HP;
		hpDisp.innerHTML = tempHP;
	}
	if (scoreVisibleTemp) {
		scoreRedTemp = data.tourney.manager.gameplay.score.left;
		scoreBlueTemp = data.tourney.manager.gameplay.score.right;

		animation.playScoreRed.update(scoreRedTemp);
		animation.playScoreBlue.update(scoreBlueTemp);

		if (scoreRedTemp > scoreBlueTemp) {
			// Red is Leading
			// playScoreRed.style.backgroundColor = "#CC0092";
			console.log("Red Leading");
			playScoreRed.style.transform = "translateY(-10px) scale(1.1)";

			// playScoreBlue.style.backgroundColor = "#8D0065";
			playScoreBlue.style.transform = "translateY(0) scale(1)";
		} else if (scoreRedTemp == scoreBlueTemp) {
			// Tie
			// playScoreRed.style.backgroundColor = "#8D0065";
			console.log("Tie");
			playScoreRed.style.transform = "translateY(0px) scale(1)";

			// playScoreBlue.style.backgroundColor = "#8D0065";
			playScoreBlue.style.transform = "translateY(0px) scale(1)";
		} else {
			// Blue is Leading
			// playScoreRed.style.backgroundColor = "#8D0065";
			console.log("Blue Leading");
			playScoreRed.style.transform = "translateY(0) scale(1)";

			// playScoreBlue.style.backgroundColor = "#CC0092";
			playScoreBlue.style.transform = "translateY(-10px) scale(1.1)";
		}
	}
	if (!scoreVisibleTemp) {
		if (chatLen != data.tourney.manager.chat.length) {
			// There's new chats that haven't been updated

			if (
				chatLen == 0 ||
				(chatLen > 0 && chatLen > data.tourney.manager.chat.length)
			) {
				// Starts from bottom
				chats.innerHTML = "";
				chatLen = 0;
			}

			// Add the chats
			for (var i = chatLen; i < data.tourney.manager.chat.length; i++) {
				tempClass = data.tourney.manager.chat[i].team;

				// Chat variables
				let chatParent = document.createElement("div");
				chatParent.setAttribute("class", "chat");

				let chatTime = document.createElement("div");
				chatTime.setAttribute("class", "chatTime");

				let chatName = document.createElement("div");
				chatName.setAttribute("class", "chatName");

				let chatText = document.createElement("div");
				chatText.setAttribute("class", "chatText");

				chatTime.innerText = data.tourney.manager.chat[i].time;
				chatName.innerText = data.tourney.manager.chat[i].name + ":\xa0";
				chatText.innerText = data.tourney.manager.chat[i].messageBody;

				chatName.classList.add(tempClass);

				chatParent.append(chatTime);
				chatParent.append(chatName);
				chatParent.append(chatText);
				chats.append(chatParent);
			}

			// Update the Length of chat
			chatLen = data.tourney.manager.chat.length;

			// Update the scroll so it's sticks at the bottom by default
			chats.scrollTop = chats.scrollHeight;
		}
	}
};
