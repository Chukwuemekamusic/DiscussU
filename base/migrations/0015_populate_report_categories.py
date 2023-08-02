from django.db import migrations

CATEGORIES = [
    ("Inappropriate Content",
     "Flag content that contains offensive language, imagery, hate speech, or harassment/bullying."),
    ("Spam or Self-promotion",
     "Flag content that is irrelevant, off-topic, self-promotion, or advertising."),
    ("Misinformation/Fake News", "Flag content that is misinformation or fake news."),
    ("Other", "Flag content for other reasons not covered by the above categories."),
]


def create_report_categories(apps, schema_editor):
    ReportCategory = apps.get_model("base", "ReportCategory")

    for category_name, category_description in CATEGORIES:
        ReportCategory.objects.create(
            name=category_name, description=category_description)


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0014_populate_report_categories'),
    ]

    operations = [
        migrations.RunPython(create_report_categories),
    ]
