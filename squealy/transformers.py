from collections import OrderedDict

from django.utils.datastructures import OrderedSet

from .table import Table


class TableTransformer(object):
    def transform(self, table, *args):
        """
        To be implemented in inherited classes
        """
        return table


class Transpose(TableTransformer):
    def transform(self, table):
        """Converts rows into columns and vice versa
        1. The first column in the original
           becomes the column names in the transformed
        2. The column names in the original
           become the values in the first column in the transformed
        """
        column_names = table.columns
        table.data.insert(0, column_names)
        transposed = list(zip(*table.data))

        new_table = Table()
        if transposed:
            new_table.columns = transposed[0]
            del transposed[0]
        new_table.data = transposed
        return new_table


class Split(TableTransformer):

    def transform(self, table, pivot_column, metric_column):
        """Returns pivot table based on the pivot column"""
        # NOTE:: Split transformation is for single metric. Future implementation for multiple metric
        # Get index of the pivot column
        pivot_column_index = table.columns.index(pivot_column)
        # Find the index of the metric column
        metric_column_index = table.columns.index(metric_column)
        new_split_columns = OrderedSet([])
        # Get values of new columns
        for data in table.data:
            new_split_columns.add(data[pivot_column_index])
        new_split_columns = list(new_split_columns)

        # Set the metric for the new columns
        grouping_column_index = 0
        new_split_data = OrderedDict()
        new_data = []
        for index,data in enumerate(table.data):
            temp_metric = data[metric_column_index]
            temp_pivot_value = data[pivot_column_index]
            temp_grouping_column = data[grouping_column_index]
            if not new_split_data.get(temp_grouping_column):
                new_split_data[temp_grouping_column] = ['-']*len(new_split_columns)
            new_split_data[temp_grouping_column][new_split_columns.index(temp_pivot_value)] = temp_metric

        for key in new_split_data:
            new_data.append([key] + new_split_data[key])
        table.columns = table.columns[:pivot_column_index] + [column for column in new_split_columns]
        table.data = new_data
        return table


class Merge(TableTransformer):

    def transform(self, table, columns_to_merge, new_column_name="merged_column"):
        """
        Returns table objects with merged columns and data
        """
        cur_columns = table.columns
        columns_to_merge_index = [cur_columns.index(column) for column in columns_to_merge]
        data = []
        for index,row in enumerate(table.data):
            temp_row = []
            temp_merge_value = []
            for row_index,value in enumerate(table.data[index]):
                if row_index not in columns_to_merge_index:
                    temp_row.append(value)
                else:
                    temp_merge_value.append(value)
            # create rows for merged values
            for merge_value in temp_merge_value:
                row_copy = list(temp_row)
                row_copy.append(merge_value)
                data.append(row_copy)
        new_columns = []

        for column in table.columns:
            if column not in columns_to_merge:
                new_columns.append(column)
        new_columns.append(new_column_name)
        return Table(new_columns, data)