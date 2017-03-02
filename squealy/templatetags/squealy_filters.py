import json

from django.utils.safestring import mark_safe
from django import template

register = template.Library()


@register.filter(name='js')
def js(obj):
    #remember to make sure the contents are actually safe before you use this filter!
    return mark_safe(json.dumps(obj))