// It uses data_handler.js to visualize elements
dom = {
    init: function () {
        let container = $('.container');
        if (container.hasClass('main')) {
            $.ajaxSetup({
                async: false
            });
            dom.createNewBoard();
            dom.loadBoards();
            dom.editCardTitle();
            $.ajaxSetup({
                async: true
            });
            dom.dragAndDrop();
        }
        if (container.hasClass('registration-container')) {
            showRegistrationMessage();
            checkRegistrationForm();
        }
    },
    isFirstLoad: true,
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
        });
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, dom.showCards);
    },
    showCards: function (cards, boardId) {
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
            dataHandler.createNewBoard(boardTitle, dom.loadBoards);
            inputElement.value = "";
        });
        dom.createNewCard();
    },
    createNewCard: function () {
        var saveButton = document.getElementById('newCardBtn');
        saveButton.addEventListener("click", function () {
            let inputElement = document.getElementById("cardInput");
            let boardId = $(this).data('boardid');
            var cardTitle = inputElement.value;
            var statusId = 1;
            var orderId = 1;
            dataHandler.createNewCard(cardTitle, boardId, statusId, orderId, dom.appendNewCard);
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
    },
    editCardTitle: function () {
        let penButtons = $('.fa-edit');
        penButtons.on('click', {}, function (event) {
            let cardId = $(this).closest($('.card')).data('id');
            let currentCardTitle = $(this).closest('.editBtn').siblings('.cardTitle');
            let currentCardTitleContent = currentCardTitle.text();
            let inputField = `<input id="newCardTitle" type="text" name="newTitle" maxlength="44" value="${currentCardTitleContent}">`;
            currentCardTitle.replaceWith(inputField);

            let input = $('#newCardTitle');

            input.on('focusout', function () {
                let newTitle = $(input).val();
                dataHandler.saveCardTitle(cardId, newTitle);
                newTitleContent = `<div class="cardTitle">${newTitle}</div>`;
                editedInputField = $('#newCardTitle');
                editedInputField.replaceWith(newTitleContent);
            })
        })
    },
    appendNewCard: function (boardId, cardId, orderId, cardTitle) {
        let cardContent = `
                            <div class="card container" data-id="${cardId}" data-order="${orderId}" data-boardId="${boardId}">
                                <div class="editBtn"><a class="far fa-edit"></a></div>
                                <div class="cardTitle">${cardTitle}</div>
                            </div>`;
        let cardContainer = $(`.card-container[data-newBoardId=${boardId}]`);
        cardContainer.append(cardContent);
        dom.editCardTitle();
    },
    dragAndDrop: function () {
        var boardDetailsContainers = document.getElementsByClassName("dragCont");
        let containers = Array.prototype.slice.call(boardDetailsContainers);
        let drake = dragula({containers: containers});
        drake.on('drop', function (el) {
            let cardId = parseInt(el.dataset.id);
            let boardId = parseInt(el.parentNode.parentNode.parentNode.dataset.boardid);
            let newStatus = parseInt(el.parentNode.parentNode.dataset.statusid);
            dataHandler.editCard(boardId, cardId, newStatus);
        })
    },
    generateBoard: function (cards, board) {
        var statusContents = {
            new: "",
            in_progress: "",
            testing: "",
            done: ""
        };
        $.each(cards, function (i, card) {
            let cardContent = `
                        <div class="card" data-id="${card['id']}" data-order="${card['order']}" data-boardId="${card['board-id']}">
                            <div class="editBtn"><a class="far fa-edit"></a></div>
                            <div class="cardTitle">${card['title']}</div>
                        </div>`;
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
    },
    appendTableContent: function (cards, board) {
        let table = $("#mainBoard");
        let statuses = ["New", "In progress", "Testing", "Done"];
        let statusesKeys = ["new", "in_progress", "testing", "done"];
        let statusesContent = "";
        let isHidden = "hidden";
        let arrowIcon = "fa fa-angle-down";
        if (board['is_active'] == true) {
            isHidden = "";
            arrowIcon = "fa fa-angle-up";
        }
        $.each(statuses, function (i, status) {
            statusesContent +=
                `<div class="board-details-container col-md-3 col-sm-6 col-12" data-statusid="${i + 1}">
                    <div>${status}</div>
                    <div class="card-container dragCont" data-${statusesKeys[i]}BoardId="${board['id']}"}>
                        ${cards[statusesKeys[i]]}
                    </div>
                 </div>`;
        });
        let tableContent =
            `<div class="board-container" data-boardId="${board['id']}">
                    <div class="board-header col-12">
                        ${board['title']}
                        <button type="button" class="btn btn-success addCard" data-toggle="modal" data-target="#newcard" data-boardid="${board['id']}">
                            Add Card <i data-boardId="${board['id']}" class="far fa-plus-square"></i>
                        </button>
                        <button class="btn btn-info arrow" data-boardId="${board['id']}">
                            <i class="${arrowIcon}"></i>
                        </button>
                    </div>
                    <div class="board-content row ${isHidden}" data-boardId="${board['id']}">
                        ${statusesContent}
                    </div>
                 </div>
                `;
        table.append(tableContent);
        dom.toggleEvent();
        let addCardBtn = $(`.addCard[data-boardid=${board['id']}]`);
        addCardBtn.on("click", function () {
            $("#newCardBtn").data("boardid", board['id']);
        })
    },
    toggleEvent: function () {
        let toggleBtns = $(".arrow");

        for (let btn of toggleBtns) {
            $(btn).off("click");
            $(btn).on("click", function () {
                let btnBoardId = $(this).data('boardid');
                let boards = $(".row");

                for (let board of boards) {
                    if (board.dataset.boardid == btnBoardId) {
                        if (board.classList.contains("hidden")) {
                            $(board).removeClass("hidden");
                            $(this).find("i").removeClass("fa fa-angle-down");
                            $(this).find("i").addClass("fa fa-angle-up");
                            $.ajax("/save-boardStatus", {
                                method: 'POST',
                                data: {
                                    boardId: btnBoardId,
                                    is_active: true
                                }
                            })
                        } else {
                            $(board).addClass("hidden");
                            $(this).find("i").removeClass("fa fa-angle-up");
                            $(this).find("i").addClass("fa fa-angle-down");
                            $.ajax("/save-boardStatus", {
                                method: 'POST',
                                data: {
                                    boardId: btnBoardId,
                                    is_active: false
                                }
                            })
                        }
                    }
                }
            })
        }
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