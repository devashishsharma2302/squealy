import arrow

from squealy.exception_handlers import DateParseException, PermissionDeniedException


class StringParameter:
    def __init__(self, name, description=None, default_value=None, valid_values=None):
        self.default_value = None
        self.valid_values = valid_values
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        if isinstance(value, str):
            return value
        else:
            return str(value)

    def is_valid(self, value):
        if not self.valid_values:
            return True
        if value in self.valid_values:
            return True
        return False


class DateParameter:
    def __init__(self, name, description=None, default_value=None, format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        try:
            if (value.lower() == "today"):
                date = arrow.utcnow()
                if self.format:
                    return date.format(self.format)
                return str(date.date())
            else:
                date = arrow.get(value, self.format)
                if self.format:
                    return date.format(self.format)
                return str(date.date())
        except arrow.parser.ParserError:
            if self.format:
                raise DateParseException("Date could not be parsed:\
                                         Received value - " + value +
                                         "Expected Format - "+self.format)
            else:
                raise DateParseException("Invalid date", value)


class DateTimeParameter:
    def __init__(self, name, description=None, default_value=None, format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        try:
            if (value.lower() == "now"):
                date = arrow.utcnow()
                if self.format:
                    return date.format(self.format)
                return str(date.format())
            else:
                date = arrow.get(value, self.format)
                if self.format:
                    return date.format(self.format)
                return str(date.format())
        except arrow.parser.ParserError:
            if self.format:
                raise DateParseException("DateTime could not be parsed:\
                                         Received value - " + value +
                                         "Expected Format - "+self.format)
            else:
                raise DateParseException("Invalid DateTime", value)

class PermissionValidator:
    """Checks if the user has permission to call this API
    api - the API that is being invoked
    params - the parameters provided by the user
    session - the session object that identifies the user

    If the user has permission, this method returns nothing
    Otherwise, the method raises PermissionDeniedError
    """

    def __init__(self, required_permissions, user_permission_mapper):
        self.required_permissions = required_permissions
        self.user_permission_mapper = user_permission_mapper
        pass

    def has_permission(self, session):
        granted_permissions = self.user_permission_mapper.get_permissions(session)
        for permission in self.required_permissions:
            if permission not in granted_permissions:
                raise PermissionDeniedException("Forbidden[403]: Permission Denied")


class UserPermissionMapper:
    def get_permissions(self, session):
        pass


class SqlUserPermissionMapper:
    """
    Runs a query to find out all possible permissions for the user

    Let's say you have the following tables -
    Users, UserRoles, RolePermissions and Permissions
    So you write the query:

    select p.permission from
    Users u inner join UserRoles ur
        on u.id = ur.userid
    join RolePermissions rp
        on ur.roleid = rp.roleid
    join Permissions p
        on rp.permissionid = p.id
    where
        u.id = {{params.userid}}

    """
    def __init__(self, connection, sql):
        self.connection = connection
        self.sql = sql

    def get_permissions(self, session):
        pass


class SessionPermissionMapper:
    """Gets permissions from the session object"""
    def __init__(self, lookup_key_name='permissions'):
        self.lookup_key_name = lookup_key_name

    def get_permissions(self, session):
        if self.lookup_key_name in session:
            return session[self.lookup_key_name]
        else:
            return []
