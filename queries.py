import data_manager


def get_boards(user_id):
    return data_manager.execute_select('''SELECT * FROM boards
                                        WHERE user_id = %(user_id)s;
                                       ''',
                                       {'user_id': user_id})


def get_cards(board_id):
    return data_manager.execute_select('''SELECT * FROM cards
                                        WHERE board_id = %(board_id)s;
                                       ''',
                                       {'board_id': board_id})
