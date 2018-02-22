dataHandler = {
    getBoards: function (callback) {
        $.ajax('/get-boards', {
            method: 'POST',
            success: function (boards) {
                callback(boards);
            }
        })
    },
    getBoard: function (boardId, callback) {
        $.ajax('/get_new_board', {
            method: 'POST',
            data: {
                board_id: boardId
            },
            success: function (boards) {
                callback(boards);
            }
        })
    },
    getCards: function (boardId, board, callback) {
        $.ajax("get-cards", {
            method: 'POST',
            data: {
                boardId: boardId
            },
            success: function (cards) {
                return callback(cards, board)
            }
        })
    },
    createNewBoard: function (boardTitle, callback) {
        $.ajax('/create-new-board', {
            method: 'POST',
            data: {
                boardTitle: boardTitle
            },
            success: function (new_board_id) {
                callback(isFirstLoad = false, new_board_id);
            }
        })
    },
    createNewCard: function (cardTitle, boardId, statusId, orderId, callback) {
        $.ajax("create-new-card", {
            method: 'POST',
            data: {
                cardTitle: cardTitle,
                boardId: boardId,
            },
            success: function (returnData) {
                return callback(boardId, returnData[0], returnData[1], cardTitle);
            }
        });
    },
    editCard: function (boardId, cardId, statusId, order) {
        $.ajax('/get-card', {
            method: 'POST',
            data: {
                card_id: cardId
            },
            success: function (card) {
                if (card[0]["board_id"] !== parseInt(boardId)) {
                    throw "You cannot move card to another board!";
                }
                $.ajax("edit-card", {
                    method: 'POST',
                    data: {
                        status_id: statusId,
                        card_id: cardId,
                        order: order
                    }
                });
            }
        })
    },
    editTitle: function (cardId, newTitle) {
        card = dataHandler.getCard(cardId);
        card.title = newTitle;
        this._saveData();
    },
};