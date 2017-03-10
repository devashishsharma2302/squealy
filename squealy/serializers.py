from rest_framework import serializers

from squealy.models import Chart


class ChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chart
        fields = ('id', 'name', 'url', 'query', 'type', 'options', 'account', 'transformations',
                  'validations', 'parameters', 'database')
        depth = 1
