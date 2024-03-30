from random import randint

from faker import Faker
from faker.providers.phone_number.en_US import Provider as PhoneNumberProvider
from tortoise import Tortoise, run_async

from server.config import DATABASE_URL
from server.models import Person, Crime

PhoneNumberProvider.formats = ('+38-###-###-####',)


async def create_seed_data():
    await Tortoise.init(
        db_url=DATABASE_URL,
        modules={"models": ["server.models"]}
    )

    await Tortoise.generate_schemas()

    fake = Faker(locale='en_US')

    for _ in range(100):
        person = await Person.create(
            last_name=fake.last_name(),
            first_name=fake.first_name(),
            date_of_birth=fake.date_of_birth(),
            gender=fake.random_element(elements=('Male', 'Female')),
            address=fake.address(),
            position=','.join(fake.location_on_land(True)),
            citizenship=fake.country(),
            phone_number=fake.phone_number(),
            email=fake.email(),
            country_of_birth=fake.country()
        )
        for _ in range(randint(0, 5)):
            await Crime.create(
                date=fake.date_this_decade(),
                location=fake.address(),
                position=','.join(fake.location_on_land(True)),
                description=fake.sentence(),
                investigation_status=fake.random_element(elements=('Open', 'Closed')),
                person=person
            )
    await Tortoise.close_connections()


run_async(create_seed_data())
