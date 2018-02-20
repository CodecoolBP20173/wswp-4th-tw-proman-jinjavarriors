from flask import Flask, render_template
import password

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_name = request.form['logUserName']
        user_password = request.form['logPass']
        hashed_pass = queries.get_hashed_pass(user_name)
        check_login = password.verify_password(password, hashed_pass)
        if check_login == True:
            return render_template('boards.html')
        else:
            return render_template('login.html', wrongpass=False)
    return render_template('login.html')


@app.route('/registration')
def registration():
    if request.method == 'POST':
        username = request.form["regusername"]
        password = request.form["regpassword"]
        isUser = queries.check_username(username)
        if isUser:
            return redirect(url_for("registration"))
        else:
            hashed_bytes = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            hashed_password = hashed_bytes.decode('utf-8')
            queries.create_user(username, hashed_password)
            return redirect(url_for("login"))
    else:
        return render_template("registration.html")


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
