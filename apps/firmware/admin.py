from django.contrib import admin
from django import forms
from django.contrib.admin.models import LogEntry
from pagedown.widgets import AdminPagedownWidget
from django.db import IntegrityError, transaction
from django.contrib import messages

from .models import Firmware
from .utils import makedirs

def upload_file(file, output, write_type, enc):
        with open(output, write_type, encoding=enc) as f:
           f.write(file)

class FirmwareForm(forms.ModelForm):
    firmware = forms.FileField()
    changelog = forms.CharField(widget=AdminPagedownWidget())

    class Meta:
        model = Firmware
        fields = [
            'version',
        ]
        widgets = {
            'version': forms.TextInput(),
        }

class FirmwareAdmin(admin.ModelAdmin):
    form = FirmwareForm

    def save_model(self, request, obj, form, change):
        form_data = form.cleaned_data
        fw = form_data["firmware"].file.getvalue()
        chl = form_data["changelog"]
        output_dir = 'uploads/' + form_data["version"]

        makedirs(output_dir)

        fw_output = output_dir + '/firmware.bin'
        changelog_output = output_dir + '/changelog.md'

        upload_file(fw, fw_output, "wb", None)
        upload_file(chl, changelog_output, "w", "utf-8")

        try:
          with transaction.atomic():
            super().save_model(request, obj, form, change)
        except IntegrityError as e:
            print(e)

    def get_form(self, request, obj, **kwargs):
        form = super(FirmwareAdmin, self).get_form(request, obj, **kwargs)

        if obj != None:
            fw_version = obj.version
            chl_p = 'uploads/' + fw_version + '/changelog.md'

            form.base_fields['version'].disabled = True

            with open(chl_p, encoding="utf-8") as f:
              form.base_fields['changelog'].initial = f.read()
        else:
            form.base_fields['changelog'].initial = ""


        return form

    def get_fields(self, request, obj=None):
        fields = super(FirmwareAdmin, self).get_fields(request, obj)
        fields_list = list(fields)
        if obj:
            fields_list.remove('firmware')
        fields_tuple = tuple(fields_list)
        return fields_tuple

    def render_change_form(self, request, context, add=True, change=True, form_url='', obj=None):
        context.update({
            'show_save_and_continue': False,
            'show_save_and_add_another': False
        })
        return super().render_change_form(request, context, add, change, form_url, obj)


admin.site.register(Firmware, FirmwareAdmin)

LogEntry.objects.all().delete()

