// It uses data_handler.js to visualize elements
dom = {
    loadBoards: function() {
        dataHandler.init();
        // retrieves boards and makes showBoards called
    },
    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
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
}
