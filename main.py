from flask import Flask, render_template

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def boards():
    return render_template('login.html')


@app.route('/registration')
def registration():
    pass


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
