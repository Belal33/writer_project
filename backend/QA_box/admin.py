from django.contrib import admin
from . import models


admin.site.register(models.QABox)
admin.site.register(models.Resource)
admin.site.register(models.ResourceChunk)
admin.site.register(models.QAMessage)

# Register your models here.
