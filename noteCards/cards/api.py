from rest_framework import generics, permissions


from .serializers import CardSerializer
from .models import Card


class CardItemList(generics.ListCreateAPIView):
    model = Card
    serializer_class = CardSerializer
    permission_classes = [
        permissions.AllowAny
    ]

class CardItemDetail(generics.RetrieveAPIView):
    model = Card
    serializer_class = CardSerializer
    permission_classes = [
        permissions.AllowAny
    ]

class CardItemUpdate(generics.UpdateAPIView):
    model = Card
    lookup_field = 'title'
    serializer_class = CardSerializer
    permission_classes = [
        permissions.AllowAny
    ]
