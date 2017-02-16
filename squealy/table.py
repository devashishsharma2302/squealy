class Table:
    def __init__(self, columns=None, data=None):
        self.columns = columns if columns else []
        self.data = data if data else [[]]

    def columns_to_str(self):
        return [str(column.name) for column in self.columns]

    def get_col_type(self):
        return [str(column.col_type) for column in self.columns]


class Column:
    def __init__(self, name, type):
        self.name = name
        self.type = type
