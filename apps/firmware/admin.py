from django.contrib import admin
from django import forms
from django.contrib.admin.models import LogEntry
from pagedown.widgets import AdminPagedownWidget
from django.db import IntegrityError, transaction
from django.conf import settings

from .models import Firmware
from common.utils import makedirs
from .firmware import upload_file, delete_fw

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

    def get_form(self, request, obj, **kwargs):
        form = super(FirmwareAdmin, self).get_form(request, obj, **kwargs)

        if obj != None:
            fw_version = obj.version
            chl_p = settings.MEDIA_ROOT + '/' + fw_version + '/changelog.md'

            form.base_fields['version'].disabled = True
            form.base_fields['firmware'].required = False

            with open(chl_p, encoding="utf-8") as f:
              form.base_fields['changelog'].initial = f.read()
        else:
            form.base_fields['changelog'].initial = ""
            form.base_fields['firmware'].required = True


        return form

    def get_fields(self, request, obj=None):
        fields = super(FirmwareAdmin, self).get_fields(request, obj)
        fields_list = list(fields)

        if obj:
            fields_list.remove('firmware')

        fields_tuple = tuple(fields_list)
        return fields_tuple

    def save_model(self, request, obj, form, change):
        form_data = form.cleaned_data
        fw = form_data["firmware"]
        chl = form_data["changelog"]
        output_dir = settings.MEDIA_ROOT + '/' + form_data["version"]

        makedirs(output_dir)

        changelog_output = output_dir + '/changelog.md'
        upload_file(chl, changelog_output, "w", "utf-8", "\n")

        if fw:
            fw_file = fw.file.getvalue()
            fw_output = output_dir + '/firmware.bin'
            upload_file(fw_file, fw_output, "wb", None, None)

        try:
          with transaction.atomic():
            super().save_model(request, obj, form, change)
        except IntegrityError as e:
            delete_fw(form_data["version"])

    def render_change_form(self, request, context, add=True, change=True, form_url='', obj=None):
        context.update({
            'show_save_and_continue': False,
            'show_save_and_add_another': False
        })
        return super().render_change_form(request, context, add, change, form_url, obj)

    def delete_model(self, request, obj):
        delete_fw(obj.version)
        super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        with transaction.atomic():
           for obj in queryset:
               delete_fw(obj.version)
        return super().delete_queryset(request, queryset)


admin.site.register(Firmware, FirmwareAdmin)

