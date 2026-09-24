import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gift_of_presents.settings")
application = get_wsgi_application()
