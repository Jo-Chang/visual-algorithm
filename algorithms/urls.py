from django.urls import path
from . import views

app_name = "algorithms"
urlpatterns = [
    # path('', views.index, name='index'),
    path("", views.HomePageView.as_view(), name="home"),
    path("home/", views.RedirectHomeView.as_view(), name="home_re"),
]
