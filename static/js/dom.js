// It uses data_handler.js to visualize elements
dom = {
    init: function () {
        dom.createNewBoard();
        dom.loadBoards();
        dom.createNewCard();
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

        //Generate board container
        dataHandler.getStatuses(function (statuses) {
            var element = document.getElementsByClassName("board-main")[0];
            console.log(statuses);
            for (let i = 0; i < titles.length; i++) {
                let id = ids[i];
                let title = titles[i];

                var boardContainer = `<div class="board-container" id="${id}"><div class="board-header">${title}<button type="button" class="btn btn-info btn-lg addCard" data-toggle="modal" data-target="#newcard">+</button><button class="btn btn-info" id="btn-${id}">V</button></div></div>`;
                var boardContentActive = `<div id="board${id}" class="board-content row"><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[0].name}</div><div id="statusId${statuses[0].id}" class="board-details-content"></div></div><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[1].name}</div><div id="statusId${statuses[1].id}" class="board-details-content"></div></div><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[2].name}</div><div id="statusId${statuses[2].id}" class="board-details-content"></div></div><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[3].name}</div><div id="statusId${statuses[3].id}" class="board-details-content"></div></div></div>`;
                var boardContentInactive = `<div id="board${id}" class="board-content row"><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[0].name}</div><div id="statusId${statuses[0].id}" class="board-details-content"></div></div><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[1].name}</div><div id="statusId${statuses[1].id}" class="board-details-content"></div></div><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[2].name}</div><div id="statusId${statuses[2].id}" class="board-details-content"></div></div><div class="board-details-container col-md-3 col-sm-6 col-12"><div class="board-details-header">${statuses[3].name}</div><div id="statusId${statuses[3].id}" class="board-details-content"></div></div></div>`;

                appendToElement(element, boardContainer);
                if (boards[i].is_active) {
                    appendToElement(element, boardContentActive);
                } else if (!boards[i].is_active) {
                    appendToElement(element, boardContentInactive);
                }

                let openButton = document.getElementById("btn-" + id.toString());
                openButton.addEventListener("click", function () {
                    dom.loadCards(id)
                })

            }
        });


        dom.isFirstLoad = false;
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, dom.showCards);
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let board = document.getElementById('board' + boardId);
        let row = document.getElementsByClassName('board-content row')[boardId - 1];
        if (row.hasAttribute('hidden')) {
            row.removeAttribute('hidden');
        } else {
            let att = document.createAttribute('hidden');
            row.setAttributeNode(att);
        }
        var statusColumns = board.getElementsByClassName('board-details-content');
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === 1) {
                let content = statusColumns.statusId1.innerHTML;
                statusColumns.statusId1.innerHTML = '<div>' + cards[i].title + '</div>';
            } else if (cards[i].id === 2) {
                let content = statusColumns.statusId2.innerHTML;
                statusColumns.statusId2.innerHTML = '<div>' + cards[i].title + '</div>';
            } else if (cards[i].id === 3) {
                let content = statusColumns.statusId3.innerHTML;
                statusColumns.statusId3.innerHTML = '<div>' + cards[i].title + '</div>';
            } else if (cards[i].id === 4) {
                let content = statusColumns.statusId4.innerHTML;
                statusColumns.statusId4.innerHTML = '<div>' + cards[i].title + '</div>';
            }
        }


    },
    // here comes more features
    createNewBoard: function () {
        var saveButton = document.getElementById('saveBtn');
        saveButton.addEventListener('click', function () {
            var boardTitle = document.getElementById('newBoardName').value;
            dataHandler.createNewBoard(boardTitle, dom.loadBoards)
        });
    },
    createNewCard: function () {
        var addCardArray = document.getElementsByClassName("addCard");
        var boardId;
        for (let addCardBtn of addCardArray) {
            addCardBtn.addEventListener("click", function () {
                boardId = addCardBtn.parentElement.parentElement.id;
            });
        }
        ;

        var saveButton = document.getElementById('newCardBtn');
        saveButton.addEventListener("click", function () {
            var cardTitle = document.getElementById("cardInput").value;
            var statusId = 1;
            dataHandler.createNewCard(cardTitle, boardId, statusId, dom.showCards);
        });
    },
};

function appendToElement(elementToExtend, textToAppend) {
    let fakeDiv = document.createElement('div');
    fakeDiv.innerHTML = textToAppend;
    elementToExtend.appendChild(fakeDiv.firstChild);
    return elementToExtend.lastChild;
}

