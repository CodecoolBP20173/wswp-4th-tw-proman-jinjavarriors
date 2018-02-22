from flask import Flask, render_template, session, redirect, url_for, request, jsonify
import password
import queries

app = Flask(__name__)
app.secret_key = 'secret'


@app.route('/', methods=['GET', 'POST'])
def index():
    if 'user_name' in session:
        return render_template('boards.html')
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_name = request.form['logUserName']
        user_password = request.form['logPass']
        hashed_pass = queries.get_hashed_pass(user_name)
        check_login = password.verify_password(user_password, hashed_pass[0]['password'])
        if check_login:
            user_id = queries.get_userid_by_name(user_name)
            session['user_name'] = user_name
            session['userId'] = user_id
            return redirect(url_for('index'))
        else:
            return render_template('login.html', wrongpass=False)
    elif request.method == 'GET':
        return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user_name', None)
    return redirect(url_for('index'))


@app.route('/registration', methods=['GET', 'POST'])
def registration(message=''):
    if request.method == 'POST':
        username = request.form['regUserName']
        usr_password = request.form['regPass']
        is_user = queries.check_username(username)
        if is_user:
            message = 'Username taken, please choose another.'
            return render_template('registration.html', message=message)
        else:
            hashed_password = password.hash_password(usr_password)
            queries.create_user(username, hashed_password)
            return redirect(url_for('index'))
    else:
        return render_template('registration.html', message=message)


@app.route('/get-boards', methods=['POST'])
def get_boards():
    boards = queries.get_boards(session['userId'])
    return jsonify(boards)


@app.route('/get_new_board', methods=['POST'])
def get_new_board():
    board_id = request.form['board_id']
    board = queries.get_board(session['userId'], board_id)
    return jsonify(board)


@app.route('/get-cards', methods=['POST'])
def get_cards():
    board_id = str(request.form['boardId'])
    cards = queries.get_cards(board_id)
    return jsonify(cards)


@app.route('/get-userid', methods=['GET'])
def send_userid():
    return session['userId']


@app.route('/create-new-board', methods=['POST'])
def create_new_board():
    board_name = request.form['boardTitle']
    user_id = queries.get_userid_by_name(session['user_name'])
    new_table_id = queries.create_board(board_name, user_id)
    return jsonify(new_table_id[0])


@app.route('/create-new-card', methods=['POST'])
def create_new_card():
    user_id = queries.get_userid_by_name(session['user_name'])
    card_title = request.form['cardTitle']
    board_id = request.form['boardId']
    returnData = queries.create_new_card(card_title, board_id, user_id)
    return jsonify(returnData)


@app.route('/save-boardStatus', methods=['POST'])
def save_boardStatus():
    board_id = request.form['boardId']
    is_active = request.form['is_active']
    queries.save_board_status(board_id, is_active)
    return "Okay"


@app.route('/edit-card', methods=['POST'])
def edit_card():
    status_id = request.form['status_id']
    card_id = request.form['card_id']
    queries.edit_card(card_id, status_id)
    return 'Success'


@app.route('/get-card', methods=['POST'])
def get_card():
    card_id = request.form['card_id']
    card = queries.get_card_by_id(card_id)
    return jsonify(card)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
