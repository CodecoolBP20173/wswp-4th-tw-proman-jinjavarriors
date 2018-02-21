from flask import Flask, render_template, session, redirect, url_for, request, jsonify
import password
import queries

app = Flask(__name__)
app.secret_key = 'secret'


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_name = request.form['logUserName']
        user_password = request.form['logPass']
        hashed_pass = queries.get_hashed_pass(user_name)
        check_login = password.verify_password(user_password, hashed_pass[0]['password'])
        if check_login == True:
            user_id = queries.get_userid_by_name(user_name)
            session['user_name'] = user_name
            session["userId"] = user_id
            return render_template("boards.html")
        else:
            return render_template('login.html', wrongpass=False)
    return render_template('login.html')


@app.route('/registration', methods=['GET', 'POST'])
def registration(message=''):
    if request.method == 'POST':
        username = request.form["regUserName"]
        usr_password = request.form["regPass"]
        isUser = queries.check_username(username)
        if isUser:
            message = 'Username taken, please choose another.'
            return render_template("registration.html", message=message)
        else:
            hashed_password = password.hash_password(usr_password)
            queries.create_user(username, hashed_password)
            return redirect(url_for("index"))
    else:
        return render_template("registration.html", message=message)


@app.route("/get-boards", methods=['POST'])
def get_boards():
    boards = queries.get_boards(session["userId"])
    return jsonify(boards)


@app.route("/get-cards", methods=['POST'])
def get_cards():
    board_id = str(request.form['boardId'])
    cards = queries.get_cards(board_id)
    return jsonify(cards)


@app.route("/get-userid", methods=['GET'])
def send_userid():
    return session["userId"]


@app.route('/create-new-board', methods=['POST'])
def create_new_board():
    board_name = request.form['boardTitle']
    user_id = queries.get_userid_by_name(session['user_name'])
    queries.create_board(board_name, user_id)
    return redirect('/')


@app.route('/save-boardStatus', methods=['POST'])
def save_boardStatus():
    boardId = request.form['boardId']
    is_active = request.form['is_active']
    queries.save_board_status(boardId, is_active)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
