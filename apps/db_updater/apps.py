from django.apps import AppConfig


class DbUpdaterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.db_updater'
    verbose_name_plural = 'DB'
    verbose_name = 'ERC20 & Chain Database'
