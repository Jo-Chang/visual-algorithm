from typing import Any, Dict, Optional
from django.views.generic.base import TemplateView, RedirectView

'''
# Basic Template Rendering View as FBV (Function Based View)
from django.shortcuts import render
# Create your views here.
def index(request):
    context = {}
    return render(request, 'algorithms/index.html', context)
'''

class HomePageView(TemplateView):
    template_name = "algorithms/home.html"
    
    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["a"] = "a"
        return context
    

class RedirectHomeView(RedirectView):
    permanent = False
    query_string = True
    pattern_name = "algorithms:home"
    
    def get_redirect_url(self, *args: Any, **kwargs: Any) -> str | None:
        # article = get_object_or_404(Article, pk=kwargs["pk"])
        # article.update_counter()
        print("Hello Redirect to Home")
        return super().get_redirect_url(*args, **kwargs)