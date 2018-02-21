// It uses data_handler.js to visualize elements
dom = {
    init: function () {
        let container = $('.container');
        if (container.hasClass('main')) {
            dom.createNewBoard();
            dom.loadBoards();
            dom.createNewCard();
            dom.dragAndDrop();
        }
        if (container.hasClass('registration-container')) {
            showRegistrationMessage();
            checkRegistrationForm();
        }
    }
    ,
    isFirstLoad: true
    ,
    loadBoards: function (isFirstLoad = true, boardId) {
        dataHandler.init();
        if (isFirstLoad) {
            dataHandler.getBoards(dom.showBoards);
        } else {
            dataHandler.getBoard(boardId, dom.showBoards);
        }

        // retrieves boards and makes showBoards called
    },
    showBoards: function (boards) {
        let table = $(".board-main");
        $.each(boards, function (i, board) {
            dataHandler.getCards(board['id'], board, dom.generateBoard);
        })
    }
    ,
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, dom.showCards);
    }
    ,
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
    }
    ,
    // here comes more features
    createNewBoard: function () {
        var saveButton = document.getElementById('saveBtn');
        saveButton.addEventListener('click', function () {
            var inputElement = document.getElementById('newBoardName');
            var boardTitle = inputElement.value;
            dataHandler.createNewBoard(boardTitle, dom.loadBoards);
            inputElement.value = "";
        });
    }
    ,
    createNewCard: function () {
        var addCardArray = document.getElementsByClassName("addCard");
        var boardId;
        for (let addCardBtn of addCardArray) {
            addCardBtn.addEventListener("click", function () {
                boardId = parseInt(addCardBtn.parentElement.parentElement.id);
            });
        }

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
                    if (card.dataset.id === _this.dataset.id) {
                        currentCard = card;
                    }
                    let statusId = currentCard.parentNode.id;
                    let boardId = parseInt(currentCard.parentNode.parentNode.parentNode.previousSibling.id);
                    for (let i = 1; i < 5; i++) {
                        setOrder(boardId, i);
                    }
                }, 200);
            })
        }
    }
    ,
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
    ,
    generateBoard: function (cards, board) {
        var statusContents = {
            new: "",
            in_progress: "",
            testing: "",
            done: ""
        };
        $.each(cards, function (i, card) {
            let cardContent = `<div class="card" data-id="${card['id']}" data-order="${card['order']}" 
                          data-boardId="${card['board-id']}">${card['title']}</div>`;
            if (card['status_id'] == 1) {
                statusContents.new += cardContent;
            }
            else if (card['status_id'] == 2) {
                statusContents.in_progress += cardContent;
            }
            else if (card['status_id'] == 3) {
                statusContents.testing += cardContent;
            }
            else if (card['status_id'] == 4) {
                statusContents.done += cardContent;
            }
        });
        dom.appendTableContent(statusContents, board);
    }
    ,
    appendTableContent: function (cards, board) {
        let table = $(".board-main");
        let statuses = ["New", "In progress", "Testing", "Done"];
        let statusesKeys = ["new", "in_progress", "testing", "done"];
        let statusesContent = "";
        $.each(statuses, function (i, status) {
            statusesContent +=
                `<div class="board-details-container col-md-3 col-sm-6 col-12">
                    <div>${status}</div>
                    <div class="card-container">
                        ${cards[statusesKeys[i]]}
                    </div>
                 </div>`;
        });
        let tableContent =
            `<div class="board-container" data-boardId="${board['id']}">
                    <div class="board-header col-12">
                        ${board['title']}
                        <button type="button" class="btn btn-success addCard" data-toggle="modal" data-target="#newCard">
                            Add Card <i data-boardId="${board['id']}" class="far fa-plus-square"></i>
                        </button>
                        <button class="btn btn-info arrow" data-boardId="${board['id']}">
                            <i class="fas"></i>
                        </button>
                    </div>
                    <div class="board-content row">
                        ${statusesContent}
                    </div>
                 </div>
                `;
        table.append(tableContent);
    }
};

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

function checkRegistrationForm() {
    let usr = $('#regUserName');
    let pwd = $('#regPass');
    let pwdCheck = $('#regPassRep');
    let msg = $('#message');
    let submitBtn = $('#submit');

    pwd.attr('disabled', 'disabled');
    pwdCheck.attr('disabled', 'disabled');
    submitBtn.attr('disabled', 'disabled');

    let checkUsername = function () {
        if (usr.val().length < 6) {
            msg.css('color', 'red');
            msg.html('Username shorter than 6 characters.');
            pwd.attr('disabled', 'disabled');
            pwdCheck.attr('disabled', 'disabled');
            submitBtn.attr('disabled', 'disabled');
        } else {
            pwd.removeAttr('disabled');
            pwdCheck.removeAttr('disabled');
            msg.html('');
        }
    };

    let checkPassword = function () {
        if (pwd.val() === pwdCheck.val() && pwd.val().length >= 6) {
            msg.css('color', 'green');
            msg.html('Passwords are matching.');
            submitBtn.removeAttr('disabled');
        } else {
            msg.css('color', 'red');
            msg.html('Passwords are either not matching or shorter than 8 characters.');
            submitBtn.attr('disabled', 'disabled');
        }
    };

    usr.keyup(checkUsername);
    pwd.keyup(checkPassword);
    pwdCheck.keyup(checkPassword);
}

function showRegistrationMessage() {
    let msg = $('form').data('message');
    if (msg !== '') {
        alert(msg);
    }
}