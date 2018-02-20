from flask import Flask, render_template, jsonify, request
import queries

app = Flask(__name__)


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')


@app.route("/get-boards", methods=['POST'])
def get_boards():
    boards = queries.get_boards()
    return jsonify(boards)


@app.route("/get-cards", methods=['POST'])
def get_cards():
    boardid = request.form['boardid']
    cards = queries.get_cards(boardid)
    return jsonify(cards)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
