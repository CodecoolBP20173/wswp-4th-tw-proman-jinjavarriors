import data_manager


def get_boards():
    return data_manager.execute_select('SELECT * FROM boards;')


def get_cards():
    return data_manager.execute_select('SELECT * FROM cards;')
