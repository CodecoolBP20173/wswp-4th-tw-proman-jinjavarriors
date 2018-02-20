from flask import Flask, render_template
import password
app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def boards():
    if request.method == 'POST':
        user_name = request.form['logUserName']
        password = request.form['logPass']
        hashed_pass = queries.get_hashed_pass(user_name)
        check_login = password.verify_password(password, hashed_pass)
        if check_login == True:
            return 'Logged in'
        else:
            return 'Failure login'
    return render_template('login.html')


@app.route('/registration')
def registration():
    pass


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
