// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function () {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        this._data = JSON.parse(localStorage.getItem(this.keyInLocalStorage));
    },
    _saveData: function () {
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem(this.keyInLocalStorage, JSON.stringify(this._data));
    },
    init: function () {
        this._loadData();
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards
        $.ajax('/get-boards', {
            method: 'POST',
            success: function (boards) {
                callback(boards);
            }
        })
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
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
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        callback(this._data.statuses)
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        let all_cards = this._data.cards;
        let cards = [];
        for (let i = 0; i < all_cards.length; i++) {
            let card = all_cards[i];
            if (card.board_id === boardId) {
                cards.push(card)
            }
        }
        callback(cards, boardId);
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
    getCard: function (cardId) {
        // the card is retrieved and then the callback function is called with the card

        // let cards = this._data.cards;
        // for (let i = 0; i < cards.length; i++) {
        //     if (cards[i].id === cardId) {
        //         return cards[i];
        //     }
        // }
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
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
    // here comes more features
    getNewId: function (table) {
        this._loadData();
        var ids = [];
        if (table == 'board') {
            let length = this._data.boards.length;
            for (let i = 0; i < length; i++) {
                ids.push(this._data.boards[i]['id']);
            }
        } else if (table == 'card') {
            let length = this._data.cards.length;
            for (let i = 0; i < length; i++) {
                ids.push(this._data.cards[i]['id']);
            }
        }
        var newId = Math.max(...ids) + 1;
        return newId;
    },
    checkCards: function (boardId) {
        let all_cards = this._data.cards;
        let cards = [];
        for (let i = 0; i < all_cards.length; i++) {
            let card = all_cards[i];
            if (card.board_id === boardId) {
                cards.push(card)
            }
        }
        if (cards.length === 0) {
            return false;
        } else {
            return true;
        }
    },
    saveBoardStatus: function (board) {
        board.is_active = !board.is_active;
        dataHandler._saveData();
    },
    editCard: function (boardId, cardId, statusId) {
        $.ajax('/get-card', {
            method: 'POST',
            data: {
                card_id: cardId
            },
            success: function (card) {
                if (card[0]["board_id"] !== boardId) {
                    throw "You cannot move card to another board!";
                }
                $.ajax("edit-card", {
                    method: 'POST',
                    data: {
                        status_id: statusId,
                        card_id: cardId
                    }
                });
            }
        })
    },
    loadCard: function (card) {

    },
    returnOnBoardCards: function (boardId) {
        let all_cards = document.getElementsByClassName("card");
        let cards = [];
        for (let i = 0; i < all_cards.length; i++) {
            let card = all_cards[i];
            if (card.dataset.boardid == boardId) {
                cards.push(card.dataset.id);
            }
        }

        let cardsLength = dataHandler._data.cards.length;

        var cardsAndDetails = [];
        for (var i = 0; i < cards.length; i++) {
            for (var j = 0; j < cardsLength; j++) {
                if (cards[i] == dataHandler._data.cards[j].id) {
                    cardsAndDetails.push(dataHandler._data.cards[j]);
                }
            }
        }
        return cardsAndDetails;
    },
    saveCardTitle: function (cardId, newTitle) {
        $.ajax("save-card-title", {
            method: 'POST',
            data: {
                cardTitle: newTitle,
                cardId: cardId,
            },
        });
    },
    saveOrders: function (newOrder) {
        for (let cardId in newOrder) {
            card = dataHandler.getCard(parseInt(cardId));
            card.order = newOrder[cardId];
        }
        this._saveData();
    }
};