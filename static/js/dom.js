// It uses data_handler.js to visualize elements
dom = {
    init: function () {
        dom.createNewBoard();
        dom.loadBoards();
        dom.createNewCard();
        dom.dragAndDrop();
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
                                                <button type="button" class="btn btn-success addCard" data-toggle="modal" data-target="#newcard">
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
                                                <div id="statusId${statuses[0].id}" class="board-details-content dragCont h-100"></div>
                                            </div>
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[1].name}</div>
                                                <div id="statusId${statuses[1].id}" class="board-details-content dragCont h-100"></div>
                                            </div>
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[2].name}</div>
                                                <div id="statusId${statuses[2].id}" class="board-details-content dragCont h-100"></div>
                                            </div>
                                            <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                <div class="board-details-header font-weight-bold">${statuses[3].name}</div>
                                                <div id="statusId${statuses[3].id}" class="board-details-content dragCont h-100"></div>
                                            </div>
                                        </div>`;
                var boardContentInactive = `<div id="board${id}" class="board-content row" hidden>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[0].name}</div>
                                                    <div id="statusId${statuses[0].id}" class="board-details-content dragCont h-100"></div>
                                                </div>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[1].name}</div>
                                                    <div id="statusId${statuses[1].id}" class="board-details-content dragCont h-100"></div>
                                                </div>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[2].name}</div>
                                                    <div id="statusId${statuses[2].id}" class="board-details-content dragCont h-100"></div>
                                                </div>
                                                <div class="board-details-container col-md-3 col-sm-6 col-12">
                                                    <div class="board-details-header font-weight-bold">${statuses[3].name}</div>
                                                    <div id="statusId${statuses[3].id}" class="board-details-content dragCont h-100"></div>
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
        var colors = ['#ff7eb9', '#7afcff', '#feff9c', '#cdf670'];


        cards.sort(compare);

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].status_id === 1) {
                newStatusArray.push(`<div class="card" id="card${cards[i].id}" data-id="${cards[i].id}" data-order="${cards[i].order}" data-boardId="${cards[i].board_id}" contenteditable>` + cards[i].title + `</div>`);
            } else if (cards[i].status_id === 2) {
                inProgressStatusArray.push(`<div class="card" id="card${cards[i].id}" data-id="${cards[i].id}" data-order="${cards[i].order}" data-boardId="${cards[i].board_id}" contenteditable>` + cards[i].title + `</div>`);
            } else if (cards[i].status_id === 3) {
                testingStatusArray.push(`<div class="card" id="card${cards[i].id}" data-id="${cards[i].id}" data-order="${cards[i].order}" data-boardId="${cards[i].board_id}" contenteditable>` + cards[i].title + `</div>`);
            } else if (cards[i].status_id === 4) {
                doneStatusArray.push(`<div class="card" id="card${cards[i].id}" data-id="${cards[i].id}" data-order="${cards[i].order}" data-boardId="${cards[i].board_id}" contenteditable>` + cards[i].title + `</div>`);
            }
        }
        statusColumns.statusId1.innerHTML = newStatusArray.join('');
        statusColumns.statusId2.innerHTML = inProgressStatusArray.join('');
        statusColumns.statusId3.innerHTML = testingStatusArray.join('');
        statusColumns.statusId4.innerHTML = doneStatusArray.join('');

        let cardsDom = document.getElementsByClassName('card');
        for (let i = 0; i < cardsDom.length; i++) {
            var random_color = colors[Math.floor(Math.random() * colors.length)];
            cardsDom[i].style.backgroundColor = random_color;
        }

    },
    // here comes more features
    createNewBoard: function () {
        var saveButton = document.getElementById('saveBtn');
        saveButton.addEventListener('click', function () {
            var inputElement = document.getElementById('newBoardName');
            var boardTitle = inputElement.value;
            dataHandler.createNewBoard(boardTitle, dom.loadBoards)
            inputElement.value = "";
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
            let inputElement = document.getElementById("cardInput");
            var cardTitle = inputElement.value;
            var statusId = 1;
            var orderId = 1;
            dataHandler.createNewCard(cardTitle, boardId, statusId, orderId, function () {
                dom.loadCards(boardId)
            })
            inputElement.value = "";
        });
        var cards = document.getElementsByClassName("card");
        for (let card of cards) {
            card.addEventListener("focusout", function () {
                let cardId = parseInt(this.dataset.id);
                let newTitle = this.innerHTML;
                dataHandler.editTitle(cardId, newTitle);
            });
            card.addEventListener("mouseup", function () {
                let _this = this;
                setTimeout(function () {
                    let currentCard;
                    if(card.dataset.id === _this.dataset.id){
                        currentCard = card;
                    }
                    let statusId = currentCard.parentNode.id;
                    let boardId = parseInt(currentCard.parentNode.parentNode.parentNode.previousSibling.id);
                    for(let i=1;i<5;i++){
                        setOrder(boardId, i);
                    }
                }, 1000);

            })
        }

    },
    dragAndDrop: function () {
        var boardDetailsContainers = document.getElementsByClassName("dragCont");
        let containers = Array.prototype.slice.call(boardDetailsContainers);
        let drake = dragula({containers: containers});
        drake.on('drop', function (el) {
            let cardId = parseInt(el.dataset.id);
            let boardId = parseInt(el.parentNode.parentNode.parentNode.previousSibling.id);
            let parent = el.parentNode;
            let newStatus = parent.id;
            newStatus = parseInt(newStatus.charAt(8));
            dataHandler.editCard(boardId, cardId, newStatus);

        })
    }

}

function appendToElement(elementToExtend, textToAppend) {
    let fakeDiv = document.createElement('div');
    fakeDiv.innerHTML = textToAppend;
    elementToExtend.appendChild(fakeDiv.firstChild);
    return elementToExtend.lastChild;
}

function setOrder(boardId, statusId) {
    cards = dataHandler.returnOnBoardCards(boardId);
    let newOrder = {};
    var counter = 1;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].status_id === statusId) {
            newOrder[cards[i].id] = counter;
            counter++;
        }

    }
    dataHandler.saveOrders(newOrder);


}

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const genreA = a.order;
  const genreB = b.order;

  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}

