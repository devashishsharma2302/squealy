class Table:
    def __init__(self, columns=None, data=None):
        self.columns = columns if columns else []
        self.data = data if data else [[]]
