def populate_schools(apps, schema_editor):
    School = apps.get_model('base', 'School')
    schools = [
        'School of Applied Social Studies',
        'School of Computing',
        'School of Creative & Cultural Business',
        'School of Engineering',
        "Gray's School of Art",
        'School of Health Sciences',
        'School of Nursing, Midwifery & Paramedic Practice',
        'School of Pharmacy & Life Sciences',
        'Law School',
        'Scott Sutherland School of Architecture & Built Environment',
    ]
    for school_name in schools:
        School.objects.create(name=school_name)
