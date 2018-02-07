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

        }

        var element = document.getElementsByClassName("board-main")[0];

        for (let i = 0; i < titles.length; i++) {
            let id = ids[i];
            let title = titles[i];

            var nodeOpen = `<div class="board-container" id="${id}"><div class="board-header">${title}<button class="btn btn-info" id="btn-${id}">V</button></div></div>`;
            var nodeOpenHidden = '<div class="board-content row" hidden>' + '<div><button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#newcard">+</button></div>' + '<div class="board-details-container col-md-3 col-sm-6 col-12">container<div class="board-details-header">header</div><div class="board-details-content">content</div></div>'.repeat(4) + '</div>';

            appendToElement(element, nodeOpen);
            appendToElement(element, nodeOpenHidden);

            let openButton = document.getElementById("btn-" + id.toString());
            openButton.addEventListener("click", function () {
                dom.loadCards(id)
            })

        }
        dom.isFirstLoad = false;
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, dom.showCards);
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also

        let board = document.getElementById(boardId);
        let row = document.getElementsByClassName('board-content row')[boardId - 1];
        if (row.hasAttribute('hidden')) {
            row.removeAttribute('hidden');
        } else {
            let att = document.createAttribute('hidden');
            row.setAttributeNode(att);
        }

    },
    // here comes more features
    createNewBoard: function () {
        var saveButton = document.getElementById('saveBtn');
        saveButton.addEventListener('click', function () {
            var boardTitle = document.getElementById('newBoardName').value;
            dataHandler.createNewBoard(boardTitle, dom.loadBoards)
        });
    }
    createNewCard: function() {
        var saveButton = document.getElementById('newCardBtn');
        saveButton.addEventListener("click", function () {
            var cardTitle = document.getElementById("cardInput").value;
            var boardId;
            var statusId = 1; //Default value for new cards
            dataHandler.createNewCard(cardTitle, boardId, statusId);
            document.getElementById("cardInput").value = "Please enter a title";
        });
    }
    },
};

function appendToElement(elementToExtend, textToAppend) {
    let fakeDiv = document.createElement('div');
    fakeDiv.innerHTML = textToAppend;
    elementToExtend.appendChild(fakeDiv.firstChild);
    return elementToExtend.lastChild;
}

