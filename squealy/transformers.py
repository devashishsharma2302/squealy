from .table import Column, Table


class TableTransformer(object):
    def transform(self, table, *args):
        """
        To be implemented in inherited classes
        """
        return table


class Transpose(TableTransformer):
    # Fixme: Introduce Dimensions
    def transform(self, table):
        """Converts rows into columns and vice versa
        1. The first column in the original
           becomes the column names in the transformed
        2. The column names in the original
           become the values in the first column in the transformed
        """
        column_names = [c.name for c in table.columns]
        table.data.insert(0, column_names)
        transposed = list(zip(*table.data))

        new_table = Table()
        if transposed:
            new_table.columns = [Column(c, "string", "dimension") for c in transposed[0]]
            del transposed[0]
        new_table.data = transposed
        return new_table


class Split(TableTransformer):

    def transform(self, table, pivot_column):
        """Returns pivot table based on the pivot column"""
        # NOTE:: Split transformation is for single metric. Future implementation for multiple metric
        # Get index of the pivot column
        pivot_column_index = table.columns_to_str().index(pivot_column)
        # Find the index of the metric column
        metric_column_index = table.get_col_type().index("metric")
        new_split_columns = set()
        # Get values of new columns
        for data in table.data:
            new_split_columns.add(data[pivot_column_index])
        new_split_columns = list(new_split_columns)
        # Set the metric for the new columns
        for index,data in enumerate(table.data):
            temp_metric = data[metric_column_index]
            # Delete the metric column data as metric would be displayed in the new columns
            del table.data[index][metric_column_index]
            temp_pivot_value = data[pivot_column_index]
            # Delete the pivot column data as it has been split into multiple columns
            del table.data[index][pivot_column_index]
            table.data[index] = table.data[index][:pivot_column_index] + [(temp_metric if i==new_split_columns.index(temp_pivot_value) else '-') for i in range(len(new_split_columns))] + table.data[index][pivot_column_index:]
        # Delete the metric and pivot column
        del table.columns[metric_column_index]
        del table.columns[pivot_column_index]
        table.columns = table.columns[:pivot_column_index] + [Column(column,'string','dimension') for column in new_split_columns] + table.columns[pivot_column_index:]
        return table


class Merge(TableTransformer):

    def transform(self, table, columns_to_merge, new_column_name="merged_column"):
        """
        Returns table objects with merged columns and data
        """
        cur_columns = table.columns_to_str()
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
            if column.name not in columns_to_merge:
                new_columns.append(column)
        new_columns.append(Column(new_column_name, 'string', 'dimension'))
        return Table(new_columns, data)