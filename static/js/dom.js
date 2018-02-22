dom = {
    drake: null,
    init: function () {
        let container = $('.container');
        if (container.hasClass('main')) {
            $.ajaxSetup({
                async: false
            });
            dom.createNewBoard();
            dom.loadBoards();
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
        if (isFirstLoad) {
            dataHandler.getBoards(dom.showBoards);
        } else {
            dataHandler.getBoard(boardId, dom.showBoards);
        }
    },
    showBoards: function (boards) {
        $.each(boards, function (i, board) {
            dataHandler.getCards(board['id'], board, dom.generateBoard);
        });
    },
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
                    let boardId = parseInt(currentCard.parentNode.parentNode.parentNode.previousSibling.id);

                    for (let i = 1; i < 5; i++) {
                        setOrder(boardId, i);
                    }
                }, 200);
            })
        }
    },
    appendNewCard: function (boardId, cardId, orderId, cardTitle) {
        let cardContent = `<div class="card" data-id="${cardId}" data-order="${orderId}" data-boardId="${boardId}">${cardTitle}</div>`;
        let cardContainer = $(`.card-container[data-newBoardId=${boardId}]`);
        cardContainer.append(cardContent);
    },
    dragAndDrop: function () {
        var boardDetailsContainers = document.getElementsByClassName("dragCont");
        let containers = Array.prototype.slice.call(boardDetailsContainers);
        if (dom.drake !== null) {
            dom.drake.destroy()
        }
        dom.drake = dragula({containers: containers});
        dom.drake.on('drop', function (el, target, source) {
            let sourceCounter = 1;
            for (let child of source.children) {
                child.dataset.order = sourceCounter;
                sourceCounter += 1;
                let boardId = child.parentElement.parentElement.parentElement.dataset.boardid;
                let cardId = child.dataset.id;
                let statusId = child.parentElement.parentElement.dataset.statusid;
                let order = child.dataset.order;
                dataHandler.editCard(boardId, cardId, statusId, order)
            }
            let targetCounter = 1;
            for (let child of target.children) {
                child.dataset.order = targetCounter;
                targetCounter += 1;
                let boardId = child.parentElement.parentElement.parentElement.dataset.boardid;
                let cardId = child.dataset.id;
                let statusId = child.parentElement.parentElement.dataset.statusid;
                let order = child.dataset.order;
                dataHandler.editCard(boardId, cardId, statusId, order)
            }
        });
    },
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
                `<div class="board-details-container col-lg-3 col-md-6 col-12" data-statusid="${i + 1}">
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
        dom.dragAndDrop();
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
                    if (parseInt(board.dataset.boardid) === btnBoardId) {
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
    },
};

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