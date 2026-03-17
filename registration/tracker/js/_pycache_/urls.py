from django.contrib import admin
from django.urls import include, path
from django.contrib.auth import views as auth_views
from tracker import views as tracker_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/login/", auth_views.LoginView.as_view(template_name="registration/login.html"), name="login"),
    path("accounts/logout/", tracker_views.logout_view, name="logout"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("", include("tracker.urls")),
]
