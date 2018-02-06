// It uses data_handler.js to visualize elements
dom = {
    isFirstLoad: true,

    loadBoards: function () {
        dataHandler.init();
        dataHandler.getBoards(this.showBoards);
        this.createNewBoard();
        // retrieves boards and makes showBoards called
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        var titles = [];
        var ids = [];
        for (let i = 0; i < boards.length; i++) {
            let board = boards[i]
            titles.push(board.title);
            ids.push(board.id);
        }

        var element = document.getElementsByClassName("board-main")[0];

        for (let i = 0; i < titles.length; i++) {
            let id = ids[i];
            let title = titles[i];
            var isCards = dataHandler.checkCards(id);

            if (isCards && dom.isFirstLoad === false) {
                element.innerHTML = element.innerHTML + `<div class="board-container" id="${id}">
<div class="board-header">${title} <button class="btn btn-info" id="btn-${id}">V</button></div>
</div>`;
                let string_id = id.toString();
                document.getElementById("btn-" + string_id).addEventListener("click", function () {
                    dom.loadCards(id);
                });


            } else {
                element.innerHTML = element.innerHTML + `<div class="board-container" id="${id}">
<div class="board-header">${title} <button class="btn btn-info" id="btn-${id}">+</button></div>
</div>`;
                let string_id = id.toString();
                document.getElementById("btn-" + string_id).addEventListener("click", function () {
                    dataHandler.createNewCard();
                });
            }
        }
        dom.isFirstLoad = false;
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    createNewBoard: function () {
        var saveButton = document.getElementById('saveBtn');
        saveButton.addEventListener('click', function () {
            var boardTitle = document.getElementById('newBoardName').value;
            dataHandler.createNewBoard(boardTitle, dom.loadBoards)
        });
    }
}

