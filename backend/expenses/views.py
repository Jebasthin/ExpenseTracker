from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from .models import Expense
from .serializers import UserSerializer, RegisterSerializer, ExpenseSerializer

class CustomPagination(PageNumberPagination):
    page_size = 5  # Show 5 items per page for better UI layout demo
    page_size_query_param = 'page_size'
    max_page_size = 50

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "User registered successfully."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ExpenseListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch expenses belonging only to the authenticated user
        queryset = Expense.objects.filter(user=request.user)

        # Apply Search Filter (searches title and description)
        search_query = request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(description__icontains=search_query)
            )

        # Apply Category Filter
        category_query = request.query_params.get('category', None)
        if category_query and category_query != 'All':
            queryset = queryset.filter(category=category_query)

        # Apply Ordering/Sorting
        ordering_query = request.query_params.get('ordering', '-date')  # Default: newest first
        # Validate ordering field to prevent SQL injection or crash
        allowed_ordering = ['date', '-date', 'amount', '-amount', 'title', '-title']
        if ordering_query in allowed_ordering:
            queryset = queryset.order_by(ordering_query, '-created_at')
        else:
            queryset = queryset.order_by('-date', '-created_at')

        # Apply Pagination
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request, view=self)
        serializer = ExpenseSerializer(paginated_queryset, many=True)
        
        # Include category choice list metadata in response so frontend knows choices
        category_choices = [{"value": choice[0], "label": choice[1]} for choice in Expense.CATEGORY_CHOICES]
        
        paginated_response = paginator.get_paginated_response(serializer.data)
        paginated_response.data['categories'] = category_choices
        return paginated_response

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            # Save expense linked to current authenticated user
            expense = serializer.save(user=request.user)
            return Response(ExpenseSerializer(expense).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExpenseDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Expense, pk=pk, user=user)

    def get(self, request, pk):
        expense = self.get_object(pk, request.user)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        expense = self.get_object(pk, request.user)
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        expense = self.get_object(pk, request.user)
        expense.delete()
        return Response({
            "message": "Expense deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)
