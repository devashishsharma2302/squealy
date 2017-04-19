from rest_framework import serializers

from squealy.models import Chart, Filter


class ChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chart
        fields = ('id', 'name', 'url', 'query', 'type', 'account', 'transformations',
                  'validations', 'parameters', 'database', 'transpose')
        depth = 1


class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ('id', 'name', 'url', 'query', 'name', 'database', 'parameters')
        depth = 1