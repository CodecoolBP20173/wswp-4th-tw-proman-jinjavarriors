from flask import Flask, render_template, redirect, url_for, request
from flask import Flask, render_template, session, redirect, url_for, request, jsonify
import password
import queries

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_name = request.form['logUserName']
        user_password = request.form['logPass']
        hashed_pass = queries.get_hashed_pass(user_name)
        check_login = password.verify_password(password, hashed_pass)
        check_login = password.verify_password(user_password, hashed_pass[0]['password'])
        if check_login == True:
            return render_template('boards.html')
            userId = queries.get_userid(user_name)[0]['id']
            session["userId"] = userId
            return render_template("boards.html")
        else:
            return render_template('login.html', wrongpass=False)
    return render_template('login.html')


@app.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        username = request.form["regUserName"]
        password = request.form["regPass"]
        usr_password = request.form["regPass"]
        isUser = queries.check_username(username)
        if isUser:
            return redirect(url_for("registration"))
        else:
            hashed_password = password.hash_password(password)
            queries.create_user(username, hashed_password)
            return redirect(url_for("login"))
            hashed_password = password.hash_password(usr_password)
        return redirect(url_for("index"))
    else:
        return render_template("registration.html")


@app.route("/get-boards", methods=['POST'])
def get_boards():
    user_id = request.form['userId']
    boards = queries.get_boards(user_id)
    boards = queries.get_boards(session["userId"])
    return jsonify(boards)


@app.route("/get-cards", methods=['POST'])
def get_cards():
    board_id = request.form['boardId']
    board_id = str(request.form['boardId'])
    print(board_id)
    cards = queries.get_cards(board_id)
    print(cards)
    return jsonify(cards)


@app.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        username = request.form["regUserName"]
        password = request.form["regPass"]
        isUser = queries.check_username(username)
        if isUser:
            return redirect(url_for("registration"))
        else:
            hashed_password = password.hash_password(password)
            queries.create_user(username, hashed_password)
            return redirect(url_for("login"))
    else:
        return render_template("registration.html")


@app.route("/get-userid", methods=['GET'])
def send_userid():
    return session["userId"]


@app.route('/create-new-board', methods=['POST'])
def create_new_board():
    board_name = request.form['boardTitle']
    user_id = queries.get_userid_by_name(session['user_name'])
    queries.create_board(board_name, user_id)
    return redirect('/')


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
