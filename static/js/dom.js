// It uses data_handler.js to visualize elements
dom = {
    init: function () {
        dom.createNewBoard();
        dom.loadBoards();
    },
    isFirstLoad: true,

    loadBoards: function () {
        dataHandler.init();
        dataHandler.getBoards(dom.showBoards);

        // retrieves boards and makes showBoards called
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        var titles = [];
        var ids = [];
        for (let i = 0; i < boards.length; i++) {
            let board = boards[i];
            titles.push(board.title);
            ids.push(board.id);
        }


        if (!dom.isFirstLoad) {
            titles.splice(0, titles.length - 1);
            ids.splice(0, ids.length - 1);

            // var currentElements = document.getElementsByClassName("board-container");
            // var currentIds = [];
            // var currentTitles = []

            // for (let i = 0; i < currentElements.length; i++) {
            //     currentIds.push(parseInt(currentElements[i].id))
            // }
            //
            // for (let i = 0; i < currentElements.length; i++) {
            //     currentIds.push(parseInt(currentElements[i].title))
            // }
            //
            // ids = currentIds.pop()
            // titles =
        }

        var element = document.getElementsByClassName("board-main")[0];

        for (let i = 0; i < titles.length; i++) {
            let id = ids[i];
            let title = titles[i];
            var isCards = dataHandler.checkCards(id);

            var nodeOpen = `
                <div class="board-container" id="${id}">
                    <div class="board-header">${title}<button class="btn btn-info" id="btn-${id}">V</button></div>
                    
                </div>`;

            var nodePlus = `
                <div class="board-container" id="${id}">
                    <div class="board-header">${title}<button class="btn btn-info" id="btn-${id}">+</button></div>
                </div>`;

            if (isCards) {
                element.innerHTML = element.innerHTML + nodeOpen;
                let string_id = id.toString();
                document.getElementById("btn-" + string_id).addEventListener("click", function () {
                    dom.loadCards(id);
                });

            } else {
                element.innerHTML = element.innerHTML + nodePlus;
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
        dataHandler.getCardsByBoardId(boardId, this.showCards);
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let boardId = cards[0].board_id.toString();
        let board = document.getElementById(boardId)
        board.innerHTML = board.innerHTML + 'test';
    },
    // here comes more features
    createNewBoard: function () {
        var saveButton = document.getElementById('saveBtn');
        saveButton.addEventListener('click', function () {
            var boardTitle = document.getElementById('newBoardName').value;
            dataHandler.createNewBoard(boardTitle, dom.loadBoards)
        });
    }
};

