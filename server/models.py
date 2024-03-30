from tortoise import fields
from tortoise.models import Model

class Person(Model):
    id = fields.IntField(pk=True)
    last_name = fields.CharField(max_length=255, index=True)
    first_name = fields.CharField(max_length=255, index=True)
    date_of_birth = fields.DateField()
    gender = fields.CharField(max_length=10)
    address = fields.CharField(max_length=255)
    position = fields.CharField(max_length=255)
    citizenship = fields.CharField(max_length=255)
    phone_number = fields.CharField(max_length=20)
    email = fields.CharField(max_length=255)
    country_of_birth = fields.CharField(max_length=255)
    crimes = fields.ReverseRelation["Crime"]

class Crime(Model):
    id = fields.IntField(pk=True)
    date = fields.DateField()
    location = fields.CharField(max_length=255)
    position = fields.CharField(max_length=255)
    description = fields.TextField()
    investigation_status = fields.CharField(max_length=255)
    person = fields.ForeignKeyField("models.Person", related_name="crimes")
