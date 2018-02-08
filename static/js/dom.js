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
            for (let i = 0; i < titles.length; i++) {
                let id = ids[i];
                let title = titles[i];

                var boardContainer = `<div class="board-container" id="${id}">
                                            <div class="board-header font-weight-bold col-12">${title}
                                                <button type="button" class="btn btn-primary addCard" data-toggle="modal" data-target="#newcard">
                                                    <i id="addCard${id}" class="far fa-plus-square"></i>
                                                </button>
                                                <button class="btn btn-info arrow" id="btn-${id}">
                                                    <i id="openArrow${id}" class="fas"></i>
                                                </button>
                                            </div>
                                        </div>`;
                var boardContentActive = `<div id="board${id}" class="board-content row">
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[0].name}</div>
                                                <div id="statusId${statuses[0].id}" class="board-details-content cards"></div>
                                            </div>
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[1].name}</div>
                                            <div id="statusId${statuses[1].id}" class="board-details-content cards"></div>
                                            </div>
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[2].name}</div>
                                                <div id="statusId${statuses[2].id}" class="board-details-content cards"></div>
                                            </div>
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[3].name}</div>
                                                <div id="statusId${statuses[3].id}" class="board-details-content cards"></div>
                                            </div>
                                        </div>`;
                var boardContentInactive = `<div id="board${id}" class="board-content row" hidden>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[0].name}</div>
                                                    <div id="statusId${statuses[0].id}" class="board-details-content cards"></div>
                                                </div>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[1].name}</div>
                                                    <div id="statusId${statuses[1].id}" class="board-details-content cards"></div>
                                                </div>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[2].name}</div>
                                                    <div id="statusId${statuses[2].id}" class="board-details-content cards"></div>
                                                </div>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[3].name}</div>
                                                    <div id="statusId${statuses[3].id}" class="board-details-content cards"></div>
                                                </div>
                                            </div>`;

                appendToElement(element, boardContainer);
                if (boards[id - 1].is_active) {
                    appendToElement(element, boardContentActive);
                    let btn_icon = document.getElementById('openArrow' + id);
                    btn_icon.classList.add('fa-arrow-circle-up');
                } else if (!boards[id - 1].is_active) {
                    appendToElement(element, boardContentInactive);
                    let btn_icon = document.getElementById('openArrow' + id);
                    btn_icon.classList.add('fa-arrow-circle-down');
                }

                let openButton = document.getElementById("btn-" + id.toString());
                openButton.addEventListener("click", function () {
                    dom.loadCards(id);
                    let board = document.getElementById('board' + boards[id - 1].id);
                    let btn_icon = document.getElementById('openArrow' + id);
                    if (board.hasAttribute('hidden')) {
                        board.removeAttribute('hidden');
                        btn_icon.classList.remove('fa-arrow-circle-down');
                        btn_icon.classList.add('fa-arrow-circle-up');
                    } else {
                        let att = document.createAttribute('hidden');
                        board.setAttributeNode(att);
                        btn_icon.classList.remove('fa-arrow-circle-up');
                        btn_icon.classList.add('fa-arrow-circle-down');

                    }
                });
                openButton.addEventListener('click', function () {
                    dataHandler.getBoard(id, dataHandler.saveBoardStatus);
                });
                dom.loadCards(id);
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

        var statusColumns = board.getElementsByClassName('board-details-content');
        var newStatusArray = [];
        var inProgressStatusArray = [];
        var testingStatusArray = [];
        var doneStatusArray = [];
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].status_id === 1) {
                newStatusArray.push('<div>' + cards[i].title + '</div>');
            } else if (cards[i].status_id === 2) {
                inProgressStatusArray.push('<div>' + cards[i].title + '</div>');
            } else if (cards[i].status_id === 3) {
                testingStatusArray.push('<div>' + cards[i].title + '</div>');
            } else if (cards[i].status_id === 4) {
                doneStatusArray.push('<div>' + cards[i].title + '</div>');
            }
        }
        statusColumns.statusId1.innerHTML = newStatusArray.join('');
        statusColumns.statusId2.innerHTML = inProgressStatusArray.join('');
        statusColumns.statusId3.innerHTML = testingStatusArray.join('');
        statusColumns.statusId4.innerHTML = doneStatusArray.join('');


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
                boardId = parseInt(addCardBtn.parentElement.parentElement.id);
            });
        }
        ;

        var saveButton = document.getElementById('newCardBtn');
        saveButton.addEventListener("click", function () {
            var cardTitle = document.getElementById("cardInput").value;
            var statusId = 1;
            dataHandler.createNewCard(cardTitle, boardId, statusId, function () {
                dom.loadCards(boardId)
            });
        });
    },
};

function appendToElement(elementToExtend, textToAppend) {
    let fakeDiv = document.createElement('div');
    fakeDiv.innerHTML = textToAppend;
    elementToExtend.appendChild(fakeDiv.firstChild);
    return elementToExtend.lastChild;
}

