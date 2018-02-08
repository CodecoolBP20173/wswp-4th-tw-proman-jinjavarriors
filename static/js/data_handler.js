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
        var boards = this._data.boards;
        callback(boards);

    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        var boards = this._data.boards;
        for (let i = 0; i < boards.length; i++) {
            let board = boards[i];
            if (board.id === boardId) {
                callback(board)
            }
        }
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
    getCard: function (cardId) {
        // the card is retrieved and then the callback function is called with the card
        let cards = this._data.cards;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === cardId) {
                return cards[i];
            }
        }
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        var newId = this.getNewId('board');
        this._data.boards.push({
            'id': newId,
            'title': boardTitle,
            'is_active': true
        });
        this._saveData();
        callback();

    },
    createNewCard: function (cardTitle, boardId, statusId, orderId, callback) {
        var newId = this.getNewId('card');
        this._data.cards.push({
            'id': newId,
            'title': cardTitle,
            'board_id': boardId,
            'status_id': statusId,
            'order_id': orderId
        });
        this._saveData();
        var cards = dataHandler.getCardsByBoardId(boardId, function () {

        });
        callback(cards, boardId);
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
        card = dataHandler.getCard(cardId);
        if (card.board_id != boardId) {
            throw "You cannot move card to another board!";
        }
        card.status_id = statusId;
        card.board_id = boardId;
        this._saveData();
    },
    returnCards: function (boardId) {
        let all_cards = this._data.cards;
        let cards = [];
        for (let i = 0; i < all_cards.length; i++) {
            let card = all_cards[i];
            if (card.board_id === boardId) {
                cards.push(card);
            }
        }
        return cards;
    },
    editTitle: function(cardId,newTitle) {
        card = dataHandler.getCard(cardId);
        card.title = newTitle;
        this._saveData();
    },
    saveOrders: function (newOrder) {
        for(let cardId in newOrder){
            card = dataHandler.getCard(parseInt(cardId));
            card.order = newOrder[cardId];
            this._saveData();
        }

    }
}

