from rest_framework import serializers

from squealy.models import Chart, Filter, Parameter




class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        exclude = ('kwargs',)

class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ('id', 'name', 'url', 'query', 'name', 'database', 'parameters')
        depth = 1

class ChartSerializer(serializers.ModelSerializer):
    parameters = ParameterSerializer(many=True)

    class Meta:
        model = Chart
        fields = ('id', 'name', 'url', 'query', 'type', 'account', 'transformations',
                  'validations', 'parameters', 'database', 'transpose')
        depth = 1
