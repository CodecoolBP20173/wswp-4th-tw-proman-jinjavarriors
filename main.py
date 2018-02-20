from flask import Flask, render_template, jsonify, request
import queries

app = Flask(__name__)


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')


@app.route("/get-boards", methods=['POST'])
def get_boards():
    user_id = request.form['userId']
    boards = queries.get_boards(user_id)
    return jsonify(boards)


@app.route("/get-cards", methods=['POST'])
def get_cards():
    board_id = request.form['boardId']
    cards = queries.get_cards(board_id)
    return jsonify(cards)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
