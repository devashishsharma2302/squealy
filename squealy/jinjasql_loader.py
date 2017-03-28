import datetime
from jinja2 import DictLoader
from jinja2 import Environment
from jinjasql import JinjaSql
from dateutil.relativedelta import relativedelta

from squealy.exceptions import InvalidDateRangeException


def configure_jinjasql():
    """
    Configure the environment and return jinjaSql object
    """
    utils = """
        {% macro date_range(day, range) -%}
            {{day |safe}} between {{calculate_start_date(range)}} and {{get_today()}}
        {%- endmacro %}
        """
    loader = DictLoader({"utils.sql": utils})
    env = Environment(loader=loader)
    env.globals['calculate_start_date'] = calculate_start_date
    env.globals['get_today'] = get_today
    return JinjaSql(env)


def calculate_start_date(range):
    """
    Jinja filter to return start date based upon the range input and current date
    """
    today = datetime.date.today()

    start_date_mapping = {
        "last_3_days": today + relativedelta(days=-2),
        "last_week": today + relativedelta(days=-6),
        "last_month": today + relativedelta(months=-1),
        "last_quarter": today + relativedelta(months=-2),
        "last_half": today + relativedelta(months=-5),
        "last_year": today + relativedelta(years=-1)
    }

    start_date = start_date_mapping.get(range, None)

    if not start_date:
        raise InvalidDateRangeException("Invalid value for date_range macro in SQL query.")
    return start_date


def get_today():
    return datetime.date.today()
