from django import forms


class HtmlEditor(forms.Textarea):
    def __init__(self, *args, **kwargs):
        super(HtmlEditor, self).__init__(*args, **kwargs)
        self.attrs['class'] = 'html-editor'

    class Media:
        css = {
            'all': (
                '/static/css/codemirror.css',
                '/static/css/customize-codemirror.css'
            )
        }
        js = (
            '/static/js/codemirror.js',
            '/static/js/xml.js',
            '/static/js/htmlmixed.js',
            '/static/js/init.js'
        )
