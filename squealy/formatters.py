import copy


class Formatter:
    def format(self, table):
        pass


class SimpleFormatter(Formatter):

    def format(self, table):
        data = {"columns": [], "data": table.data}
        for column in table.columns:
            data['columns'].append({
                "name": column.name,
                "data_type": column.data_type,
                "col_type": column.col_type
            })
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
            cols.append({"id": column.name, "label": column.name, "type": col_type})
        for row in table.data:
            row_list = []
            for e in row:
                row_list.append({"v": e})
            rows.append({"c": row_list})
        return response


class HighchartsFormatter(Formatter):

    def format(self, table):
        """
        Converts the query response to data format desired by Highcharts
        Highcharts Format -> 
            [
                {
                    data: [["x-axis label name", "value"], ...],
                    name: "series name"
                }, ...
            ]
        """
        response = []
        columns = table.columns_to_str()
        column_length = len(columns)
        if column_length == 1:
            for row in table.data:
                row_list = []
                for column in columns:
                    row_list.append(row[0])
                    response.append({'data': row_list, 'name': column})
        else:
            for i in range(column_length):
                response.append({'data': []})
            for row in table.data:
                for index, column in enumerate(columns):
                    data_list = []
                    if index is not 0:
                        data_list.append(row[0])
                        data_list.append(row[index])
                        response[index-1]['data'].append(copy.deepcopy(data_list))
                        response[index-1]['name'] = column
        return response
