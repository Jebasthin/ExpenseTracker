from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food & Dining'),
        ('Transport', 'Transportation'),
        ('Utilities', 'Utilities (Bills)'),
        ('Entertainment', 'Entertainment & Leisure'),
        ('Rent', 'Rent & Housing'),
        ('Healthcare', 'Medical & Healthcare'),
        ('Education', 'Education & Learning'),
        ('Shopping', 'Shopping'),
        ('Other', 'Other Miscellaneous'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.amount} ({self.user.username})"
