import copy


class Formatter:
    def format(self, table):
        pass


class SimpleFormatter(Formatter):

    def format(self, table):
        data = {"columns": table.columns, "data": table.data}
        return data


class GoogleChartsFormatter(Formatter):

    def format(self, table):
        """
        Converts the query response to data format desired by google charts
        Google Charts Format -> 
        {
            rows: [
                "c":
                    [
                        {
                            "v": series/x-axis label name,
                            "v": value
                        },
                    ], ...
            ],
            cols: [
                {
                    "lable": Column name,
                    "type": data type for the column
                }
            ]
        }
        """
        response = {}
        response['rows'] = rows = []
        response['cols'] = cols = []
        for index, column in enumerate(table.columns):
            col_type = 'number'
            if index == 0:
                col_type = 'string'
            cols.append({"id": column, "label": column, "type": col_type})
        for row in table.data:
            row_list = []
            for e in row:
                row_list.append({"v": e})
            rows.append({"c": row_list})
        return response