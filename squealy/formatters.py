import decimal

from squealy.exceptions import InvalidChartDataException
from squealy.transformers import Split


class Formatter:
    def format(self, table):
        pass


class SimpleFormatter(Formatter):

    def format(self, table, chart_type=None):
        data = {"columns": table.columns, "data": table.data}
        return data


class GoogleChartsFormatter(Formatter):

    def _generate_chart_data(self, table, x_axis_column_index, is_table=False):
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
                    "label": Column name,
                    "type": data type for the column
                }
            ]
        }
        """
        response = {}
        response['rows'] = rows = []
        response['cols'] = cols = []

        # Adding the x-axis column
        x_axis_column = table.columns[x_axis_column_index]
        cols.append({"id": x_axis_column, "label": x_axis_column, "type": 'string'})
        del table.columns[x_axis_column_index]

        # Adding remaining columns
        if is_table:
            for index, column in enumerate(table.columns):
                cols.append({"id": column, "label": column, "type": "string"})
        else:
            for index, column in enumerate(table.columns):
                cols.append({"id": column, "label": column, "type": "number"})

        for row in table.data:
            row_list = [{"v": row[x_axis_column_index]}]
            del row[x_axis_column_index]
            for e in row:
                row_list.append({"v": e})
            rows.append({"c": row_list})
        return response

    def format(self, table, chart_type):
        """
        Automatically detects metric and dimension columns and applies appropriate transformations to generate chart data
        """
        if chart_type == 'Table':
            return self._generate_chart_data(table, 0, True)

        column_types = ['Metric'] * len(table.columns)

        for row in table.data:
            for index, data in enumerate(row):
                if (type(data) not in [int, float, long]) and (isinstance(data, decimal.Decimal) == False):
                    column_types[index] = 'Dimension'
            if 'Metric' not in column_types:
                break
        if 'Metric' not in column_types:
            raise InvalidChartDataException('No metric column found.')

        elif 'Dimension' not in column_types:
            if len(column_types) > 1:
                response = self._generate_chart_data(table, 0)
            else:
                raise InvalidChartDataException('Not enough columns to generate chart. At least 2 columns required.')

        elif column_types.count('Dimension') == 1:
            response = self._generate_chart_data(table, column_types.index('Dimension'))

        elif len(table.columns) == 3:
            # picking the first column as x-axis and performing a split keeping the other dimension as pivot
            x_axis_column_index = column_types.index('Dimension')
            pivot_column_index = column_types.index('Dimension', x_axis_column_index + 1)
            metric_column = table.columns[column_types.index('Metric')]
            table = Split().transform(table, table.columns[pivot_column_index], metric_column, x_axis_column_index)
            response = self._generate_chart_data(table, 0)

        else:
            raise InvalidChartDataException('Too many non-metric columns. Cannot generate chart type other than "Table".' +
                                            ' Select any one out of ' +
                                            str([column for index, column in enumerate(table.columns)
                                                 if column_types[index] == 'Dimension']) + ' if selecting more than 3 columns')
        return response