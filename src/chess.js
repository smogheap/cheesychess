var CHESS= {
	zoom: 2,
	selected: null,
	el_table: null,
	el_status: null,
	el_moves: null,
	el_move: null
};
function reset() {
	CHESS.board = [
		['r','n','b','q','k','b','n','r'],
		['p','p','p','p','p','p','p','p'],
		['.','.','.','.','.','.','.','.'],
		['.','.','.','.','.','.','.','.'],
		['.','.','.','.','.','.','.','.'],
		['.','.','.','.','.','.','.','.'],
		['P','P','P','P','P','P','P','P'],
		['R','N','B','Q','K','B','N','R']
	];
	CHESS.history = [];
	CHESS.turn = 1,
	CHESS.whitemove = true;

	render_board();
}

function copy_board(board) {
	var copy = [];
	board.every(function(row) {
		copy.push(row.slice());
		return true;
	});
	return copy;
}
function history_push(board) {
	CHESS.history.push(copy_board(board || CHESS.board));
}
function history_pop() {
	return CHESS.history.pop();
}

function render_board(table, board) {
	table = table || CHESS.el_table;
	board = board || CHESS.board;
	if(!table) {
		return;
	}
	while(table.firstChild) {
		table.removeChild(table.firstChild);
	}
	var tr = null;
	var th = null;
	var td = null;
	var img = null;
	var text = "";
	tr = document.createElement("tr");
	for(var y = -1; y < board.length; y++) {
		tr = document.createElement("tr");
		if(y < 0) {
			tr.appendChild(document.createElement("td"));
			for(var x = 0; x < board[y + 1].length; x++) {
				th = document.createElement("th");
				th.scope = "col";
				text = "abcdefgh".charAt(x);
				th.appendChild(document.createTextNode(text));
				tr.appendChild(th);
			}
			table.appendChild(tr);
			continue;
		}

		th = document.createElement("th");
		th.scope = "row";
		text = (board.length - y).toString();
		th.appendChild(document.createTextNode(text));
		tr.appendChild(th);
		tr.classList.add(text);
		for(var x = 0; x < board[y].length; x++) {
			td = document.createElement("td");
			td.classList.add(("abcdefgh".charAt(x) +
							  (board[y].length - y).toString()));
			if(x % 2) {
				td.classList.add((y % 2) ? "white" : "black");
			} else {
				td.classList.add((y % 2) ? "black" : "white");
			}
			img = document.createElement("img");
			img.width = img.height = 16 * CHESS.zoom;
			switch(board[y][x]) {
			case 'p':
				img.src = "gpx/blackpawn.png";
				img.alt = img.title = img.className = "black pawn";
				break;
			case 'n':
				img.src = "gpx/blackknight.png";
				img.alt = img.title = img.className = "black knight";
				break;
			case 'b':
				img.src = "gpx/blackbishop.png";
				img.alt = img.title = img.className = "black bishop";
				break;
			case 'r':
				img.src = "gpx/blackrook.png";
				img.alt = img.title = img.className = "black rook";
				break;
			case 'q':
				img.src = "gpx/blackqueen.png";
				img.alt = img.title = img.className = "black queen";
				break;
			case 'k':
				img.src = "gpx/blackking.png";
				img.alt = img.title = img.className = "black king";
				break;
			case 'P':
				img.src = "gpx/whitepawn.png";
				img.alt = img.title = img.className = "white pawn";
				break;
			case 'N':
				img.src = "gpx/whiteknight.png";
				img.alt = img.title = img.className = "white knight";
				break;
			case 'B':
				img.src = "gpx/whitebishop.png";
				img.alt = img.title = img.className = "white bishop";
				break;
			case 'R':
				img.src = "gpx/whiterook.png";
				img.alt = img.title = img.className = "white rook";
				break;
			case 'Q':
				img.src = "gpx/whitequeen.png";
				img.alt = img.title = img.className = "white queen";
				break;
			case 'K':
				img.src = "gpx/whiteking.png";
				img.alt = img.title = img.className = "white king";
				break;
			default:
				img.src = "gpx/empty.png";
				img.alt = "empty";
				break;
			}
			td.appendChild(img);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	status();
}

function status() {
	if(!CHESS.el_status) {
		return;
	}
	while(CHESS.el_status.firstChild) {
		CHESS.el_status.removeChild(CHESS.el_status.firstChild);
	}
	var text = [
		"turn ", CHESS.turn.toString(), "; ",
		(CHESS.whitemove ? "white" : "black"), " to move "
	].join("");
	CHESS.el_status.appendChild(document.createTextNode(text));
	CHESS.el_move = document.createElement("span");
	CHESS.el_status.appendChild(CHESS.el_move);
}

function coord_x(img) {
	for(var i = 0; i < CHESS.board[0].length; i++) {
		if(img.parentNode.classList.contains("abcdefgh".charAt(i))) {
			return i;
		}
	}
}
function coord_y(img) {
	if(!img) {
		console.log(img);
	}
	for(var i = 0; i < CHESS.board.length; i++) {
		if(img.parentNode.classList.contains((CHESS.board.length - i).toString())) {
			return i;
		}
	}
}

function img2coord(img) {
	var coord = "";
	if(img && img.parentNode) {
		coord = img.parentNode.className;
	}
	coord = coord.substring(0, 2);
	return coord;
}
function coord2img(coord) {
	var elm = CHESS.el_table.querySelector("td." + coord);
	return elm.firstChild;
}
function idx_x(coord) {
	return "abcdefgh".indexOf(coord.substring(0, 1));
}
function idx_y(coord) {
	return 8 - parseInt(coord.substring(1), null);
}
function idx2coord(x, y) {
	return "abcdefgh".charAt(x) + (8 - y).toString();
}
function is_empty(coord) {
}

function find_king(white) {
	if(white === undefined) {
		white = CHESS.whitemove;
	}
	console.log("find_king", "img.king." + (white?"white":"black"));
	return CHESS.el_table.querySelector("img.king." + (white?"white":"black"));
}
function find_king2(board, white) {
	if(white === undefined) {
		white = CHESS.whitemove;
	}
	for(var y = 0; y < board.length; ++y) {
		for(var x = 0; x < board[y].length; ++x) {
			if((white && board[y][x] === 'K') ||
			   (!white && board[y][x] === 'k')) {
				return idx2coord(x, y);
			}
		}
	}
	return null;
}

function is_enemy(target, piece) {
	if(!target.title) {
		return false;
	}
	if(piece) {
		if(piece === piece.toUpperCase()) {
			return target.title.indexOf("black") >= 0;
		} else {
			return target.title.indexOf("white") >= 0;
		}
	}
	if(CHESS.whitemove) {
		return target.title.indexOf("black") >= 0;
	} else {
		return target.title.indexOf("white") >= 0;
	}
}
function is_enemy2(board, coord, white) {
	if(white === undefined) {
		white = CHESS.whitemove;
	}
	var target = board[idx_y(coord)][idx_x(coord)];
	if(target === '.') {
		return false;
	}
	if(!white) {
		return target === target.toUpperCase();
	}
	return target === target.toLowerCase();
}

function flash_red(target) {
	target.parentNode.classList.add("red");
	window.setTimeout(function() {
	target.parentNode.classList.remove("red");
	}, 500);
}

function is_attacked(target) {
	console.log("is_attacked", target);
	var pieces = [];
	var attack = false;
	if(CHESS.whitemove) {
		pieces = CHESS.el_table.querySelectorAll("img.black");
	} else {
		pieces = CHESS.el_table.querySelectorAll("img.white");
	}
	for(var i = 0; i < pieces.length; ++i) {
		if(valid_move(target, true, pieces.item(i))) {
			console.log(pieces.item(i), " can attack ", target);
			flash_red(pieces.item(i));
			flash_red(target);
			attack = true;
		}
	}
	return attack;
}
function is_attacked2(board, coord, white, history) {
	if(white === undefined) {
		white = CHESS.whitemove;
	}
	var pieces = [];
	var attack = false;
	var x;
	var y;
	for(y = 0; y < board.length; ++y) {
		for(x = 0; x < board[y].length; ++x) {
			if(board[y][x] !== '.') {
				if((white && board[y][x] === board[y][x].toLowerCase()) ||
				   (!white && board[y][x] === board[y][x].toUpperCase())) {
					pieces.push(idx2coord(x, y));
				}
			}
		}
	}
	for(var i = 0; i < pieces.length; ++i) {
		if(valid_move2(board, coord, true, pieces[i], history)) {
			attack = true;
			console.log("attack true");
			console.log(pieces[i] + " can attack " + coord)
			flash_red(coord2img(pieces[i]));
			flash_red(coord2img(coord));
		}
	}
	console.log("attack", attack);
	return attack;
}
function ever_moved(coord, history) {
	var moved = false;
	var piece = null;
	var board = null;
	for(var i = 0; i < history.length; ++i) {
		board = history[i];
		if(piece === null) {
			piece = board[idx_y(coord)][idx_x(coord)];
		}
		if(piece !== board[idx_y(coord)][idx_x(coord)]) {
			moved = true;
		}
	}
	return moved;
}
function pessant_ready(board, history, coord) {
}

function valid_move(target, pretend, selected) {
	selected = selected || CHESS.selected;
	var piece = pretend || CHESS.board[coord_y(selected)][coord_x(selected)];
	if(pretend === true) {
		piece = CHESS.board[coord_y(selected)][coord_x(selected)];
	}
	var valid = false;
	switch(piece) {
	case 'p':
		// TODO: en passante
		// normal pawn move
		if(coord_x(selected) === coord_x(target) &&
		   coord_y(target) - coord_y(selected) === 1 &&
		   !target.title) {
			valid = true;
		}
		// initial pawn double-move
		if(coord_x(selected) === coord_x(target) &&
		   coord_y(target) - coord_y(selected) === 2 &&
		   coord_y(selected) === 1 && !target.title) {
			valid = true;
		}
		// capture
		if(Math.abs(coord_x(selected) - coord_x(target)) === 1 &&
		   coord_y(target) - coord_y(selected) === 1 &&
		   is_enemy(target, piece)) {
			valid = true;
		}
		// promote
		if(valid && coord_y(target) === CHESS.board.length - 1 && !pretend) {
			CHESS.board[coord_y(selected)][coord_x(selected)] = CHESS.el_promote.value.toLowerCase();
		}
		return valid;
		break;
	case 'P':
		// TODO: en pessante
		// normal pawn move
		if(coord_x(selected) === coord_x(target) &&
		   coord_y(target) - coord_y(selected) === -1 &&
		   !target.title) {
			valid = true;
		}
		// initial pawn double-move
		if(coord_x(selected) === coord_x(target) &&
		   coord_y(target) - coord_y(selected) === -2 &&
		   coord_y(selected) === 6 && !target.title) {
			valid = true;
		}
		// capture
		if(Math.abs(coord_x(selected) - coord_x(target)) === 1 &&
		   coord_y(target) - coord_y(selected) === -1 &&
		   is_enemy(target, piece)) {
			valid = true;
		}
		// promote
		if(valid && coord_y(target) === 0 && !pretend) {
			CHESS.board[coord_y(selected)][coord_x(selected)] = CHESS.el_promote.value.toUpperCase();
		}
		return valid;
		break;
	case 'n':
	case 'N':
		// knight move/capture
		if((Math.abs(coord_y(target) - coord_y(selected)) === 1 &&
			Math.abs(coord_x(target) - coord_x(selected)) === 2) ||
		   (Math.abs(coord_y(target) - coord_y(selected)) === 2 &&
			Math.abs(coord_x(target) - coord_x(selected)) === 1)) {
			return target.title ? is_enemy(target, piece) : true;
		}
		break;
	case 'b':
	case 'B':
		if(Math.abs(coord_y(target) - coord_y(selected)) ===
		   Math.abs(coord_x(target) - coord_x(selected))) {
			var x;
			for(var y = coord_y(target) - coord_y(selected); y; (y < 0) ? ++y : --y) {
				if(y === coord_y(target) - coord_y(selected)) {
					// skip furthest out
					continue;
				}
				x = Math.abs(y);
				x *= (coord_x(target) - coord_x(selected) > 0) ? 1 : -1;
				if(CHESS.board[coord_y(selected) + y][coord_x(selected) + x] !== '.') {
					return false;
				}
			}
			return target.title ? is_enemy(target, piece) : true;
		}
		break;
	case 'r':
	case 'R':
		if(Math.abs(coord_y(target) - coord_y(selected)) > 0 &&
		   coord_x(target) === coord_x(selected)) {
			for(var i = coord_y(target) - coord_y(selected); i; (i < 0) ? ++i : --i) {
				if(i === coord_y(target) - coord_y(selected)) {
					// skip furthest out
					continue;
				}
				if(CHESS.board[coord_y(selected) + i][coord_x(selected)] !== '.') {
					return false;
				}
			}
		} else if(Math.abs(coord_x(target) - coord_x(selected)) > 0 &&
		   coord_y(target) === coord_y(selected)) {
			for(var i = coord_x(target) - coord_x(selected); i; (i < 0) ? ++i : --i) {
				if(i === coord_x(target) - coord_x(selected)) {
					// skip furthest out
					continue;
				}
				if(CHESS.board[coord_y(selected)][coord_x(selected) + i] !== '.') {
					return false;
				}
			}
		} else {
			return false;
		}
		return target.title ? is_enemy(target, piece) : true;
		break;
	case 'q':
		return valid_move(target, 'b', selected) || valid_move(target, 'r', selected);
		break;
	case 'Q':
		return valid_move(target, 'B', selected) || valid_move(target, 'R', selected);
		break;
	case 'K':
	case 'k':
		// king move/capture
		if((Math.abs(coord_y(target) - coord_y(selected)) <= 1 &&
			Math.abs(coord_x(target) - coord_x(selected)) <= 1)) {
			valid = target.title ? is_enemy(target, piece) : true;
		}
		return valid;
		break;
	default:
		break;
	}
	return false;
}
function valid_move2(board, coord, pretend, piececoord, history) {
	var res = copy_board(board);
	var piece = pretend;
	if(piece === true) {
		piece = board[idx_y(piececoord)][idx_x(piececoord)];
	}
	var white = (piece === piece.toUpperCase());
	var occupied = (board[idx_y(coord)][idx_x(coord)] !== '.');
	var valid = false;
	var newboard = copy_board(board);
	switch(piece) {
	case 'p':
		// TODO: en passante
		// normal pawn move
		if(idx_x(piececoord) === idx_x(coord) &&
		   idx_y(coord) - idx_y(piececoord) === 1 &&
		   !occupied) {
			valid = true;
		}
		// initial pawn double-move
		if(idx_x(piececoord) === idx_x(coord) &&
		   idx_y(coord) - idx_y(piececoord) === 2 &&
		   idx_y(piececoord) === 1 && !occupied) {
			valid = true;
		}
		// capture
		if(Math.abs(idx_x(piececoord) - idx_x(coord)) === 1 &&
		   idx_y(coord) - idx_y(piececoord) === 1 &&
		   is_enemy2(board, coord, white)) {
			valid = true;
		}
		// promote
		if(valid && idx_y(coord) === board.length - 1 && !pretend) {
			res[idx_y(piececoord)][idx_x(piececoord)] = CHESS.el_promote.value.toLowerCase();
		}
		break;
	case 'P':
		// TODO: en pessante
		// normal pawn move
		if(idx_x(piececoord) === idx_x(coord) &&
		   idx_y(coord) - idx_y(piececoord) === -1 &&
		   !occupied) {
			valid = true;
		}
		// initial pawn double-move
		if(idx_x(piececoord) === idx_x(coord) &&
		   idx_y(coord) - idx_y(piececoord) === -2 &&
		   idx_y(piececoord) === 6 && !occupied) {
			valid = true;
		}
		// capture
		if(Math.abs(idx_x(piececoord) - idx_x(coord)) === 1 &&
		   idx_y(coord) - idx_y(piececoord) === -1 &&
		   is_enemy2(board, coord, white)) {
			valid = true;
		}
		// promote
		if(valid && idx_y(coord) === 0 && !pretend) {
			res[idx_y(piececoord)][idx_x(piececoord)] = CHESS.el_promote.value.toUpperCase();
		}
		break;
	case 'n':
	case 'N':
		// knight move/capture
		if((Math.abs(idx_y(coord) - idx_y(piececoord)) === 1 &&
			Math.abs(idx_x(coord) - idx_x(piececoord)) === 2) ||
		   (Math.abs(idx_y(coord) - idx_y(piececoord)) === 2 &&
			Math.abs(idx_x(coord) - idx_x(piececoord)) === 1)) {
			valid = occupied ? is_enemy2(board, coord, white) : true;
		}
		break;
	case 'b':
	case 'B':
		if(Math.abs(idx_y(coord) - idx_y(piececoord)) ===
		   Math.abs(idx_x(coord) - idx_x(piececoord))) {
			valid = true;
			var x;
			for(var y = idx_y(coord) - idx_y(piececoord); y; (y < 0) ? ++y : --y) {
				if(y === idx_y(coord) - idx_y(piececoord)) {
					// skip furthest out
					continue;
				}
				x = Math.abs(y);
				x *= (idx_x(coord) - idx_x(piececoord) > 0) ? 1 : -1;
				if(board[idx_y(piececoord) + y][idx_x(piececoord) + x] !== '.') {
					valid = false;
				}
			}
			if(valid) {
				valid = occupied ? is_enemy2(board, coord, white) : true;
			}
		}
		break;
	case 'r':
	case 'R':
		if(Math.abs(idx_y(coord) - idx_y(piececoord)) > 0 &&
		   idx_x(coord) === idx_x(piececoord)) {
			valid = true;
			for(var i = idx_y(coord) - idx_y(piececoord); i; (i < 0) ? ++i : --i) {
				if(i === idx_y(coord) - idx_y(piececoord)) {
					// skip furthest out
					continue;
				}
				if(board[idx_y(piececoord) + i][idx_x(piececoord)] !== '.') {
					valid = false;
				}
			}
		} else if(Math.abs(idx_x(coord) - idx_x(piececoord)) > 0 &&
		   idx_y(coord) === idx_y(piececoord)) {
			valid = true;
			for(var i = idx_x(coord) - idx_x(piececoord); i; (i < 0) ? ++i : --i) {
				if(i === idx_x(coord) - idx_x(piececoord)) {
					// skip furthest out
					continue;
				}
				if(board[idx_y(piececoord)][idx_x(piececoord) + i] !== '.') {
					valid = false;
				}
			}
		} else {
			valid = false;
		}
		if(valid) {
			valid = occupied ? is_enemy2(board, coord, white) : true;
		}
		break;
	case 'q':
		valid = (valid_move2(board, coord, 'b', piececoord, history) ||
				 valid_move2(board, coord, 'r', piececoord, history));
		break;
	case 'Q':
		valid = (valid_move2(board, coord, 'B', piececoord, history) ||
				 valid_move2(board, coord, 'R', piececoord, history));
		break;
	case 'K':
	case 'k':
		// king move/capture
		if((Math.abs(idx_y(coord) - idx_y(piececoord)) <= 1 &&
			Math.abs(idx_x(coord) - idx_x(piececoord)) <= 1)) {
			valid = occupied ? is_enemy2(board, coord, white) : true;
		} else if(Math.abs(idx_x(coord) - idx_x(piececoord)) === 2 &&
				   idx_y(coord) === idx_y(piececoord)) {
			// TODO: castling
		}
		break;
	default:
		break;
	}

	if(valid) {
		res[idx_y(coord)][idx_x(coord)] = (
			res[idx_y(piececoord)][idx_x(piececoord)]);
		res[idx_y(piececoord)][idx_x(piececoord)] = '.';
		return res;
	} else {
		return null;
	}
}

function move_piece(target) {
	history_push();
	var next = valid_move2(CHESS.board, img2coord(target), true,
						   img2coord(CHESS.selected), CHESS.history);

	// test valid movement...
	if(!CHESS.selected || !next) {
		flash_red(target);
		return;
	}

	// ...then whether in check
	if(is_attacked2(next, find_king2(next), CHESS.whitemove, history)) {
		console.log("attack claimed");
		return;
	}
	CHESS.board = next;

	// TODO: output sane notation
	var text = CHESS.selected.title + " to " + target.parentNode.className;
	CHESS.el_moves.appendChild(document.createTextNode(text));
	CHESS.el_moves.appendChild(document.createElement("br"));

	CHESS.selected.parentNode.classList.remove("select");
	CHESS.selected = null;
	move_status("");
	CHESS.whitemove = !CHESS.whitemove;
	if(CHESS.whitemove) {
		++CHESS.turn;
	}
	render_board();
}

function move_status(text) {
	while(CHESS.el_move.firstChild) {
		CHESS.el_move.removeChild(CHESS.el_move.firstChild);
	}
	CHESS.el_move.appendChild(document.createTextNode(text || ""));
}

function click(e) {
	var effect = false;
//	console.log(img2coord(e.target));
	if(e && e.target) {
		if(e.target.title &&
		   (!e.target.title.indexOf("white") && CHESS.whitemove) ||
		   (!e.target.title.indexOf("black") && !CHESS.whitemove)) {
			if(!CHESS.selected) {
//				console.log(e.target, e.target.parentNode);
				CHESS.selected = e.target;
				e.target.parentNode.classList.add("select");
				move_status(CHESS.selected.title + " to...");
				effect = true;
			} else if(CHESS.selected === e.target) {
				CHESS.selected = null;
				e.target.parentNode.classList.remove("select");
				move_status("");
				effect = true;
			}
		}
	}
	if(!effect && CHESS.selected && e.target.tagName === "IMG") {
		move_piece(e.target);
	}
}

window.addEventListener("load", function() {
	CHESS.el_table = document.querySelector("#chess");
	CHESS.el_status = document.querySelector("#status");
	CHESS.el_moves = document.querySelector("#moves");
	CHESS.el_promote = document.querySelector("#promote");

	if(CHESS.el_table) {
		CHESS.el_table.addEventListener("click", click);
	}

	reset();
});
