
def create_user(username, password):
    return data_manager.execute_dml_statement("""
    INSERT INTO users
    (user_name,password)
    VALUES(%(username)s,%(password)s)
    RETURNING id;
    """, {'username': username,
          'password': password})


def check_username(username):
    return data_manager.execute_select("""
    SELECT user_name
    FROM users
    WHERE user_name = %(username)s;
    """, {'username': username})
