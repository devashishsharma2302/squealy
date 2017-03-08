PARAMETER_TYPES = [(1, 'query'), (2, 'user')]
TRANSFORMATION_TYPES = [(1, 'Transpose'), (2, 'Split'), (3, 'Merge')]
COLUMN_TYPES = [(1, 'dimension'), (2, 'metric')]
SQL_WRITE_BLACKLIST = [
    # Data Definition
    'CREATE', 'ALTER', 'RENAME', 'DROP', 'TRUNCATE',
    # Data Manipulation
    'INSERT', 'UPDATE', 'REPLACE', 'DELETE',
]