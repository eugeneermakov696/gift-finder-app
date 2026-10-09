import os
import pandas as pd
from django.core.management.base import BaseCommand
from presents.models import Present


class Command(BaseCommand):
    help = ('Loads and streams Amazon gift listings from an Excel table '
            'directly into PostgreSQL with automated mock image injection.')

    def add_arguments(self, parser):
        parser.add_argument('excel_file', type=str, help='The relative path to the Excel file inside the container')

    def handle(self, *args, **options):
        file_path = options['excel_file']

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File tracking target missing at path: {file_path}"))
            return

        try:
            self.stdout.write(f"Parsing spreadsheet layout from target source: {file_path}")
            df = pd.read_excel(file_path)

            df.columns = [c.lower().strip() for c in df.columns]

            required_columns = ['title', 'asin', 'amazon_url', 'price']
            for col in required_columns:
                if col not in df.columns:
                    self.stderr.write(self.style.ERROR(f"Missing required target header column: '{col}'"))
                    return

            success_count = 0

            for _, row in df.iterrows():
                if pd.isna(row['asin']) or pd.isna(row['title']):
                    continue

                asin_clean = str(row['asin']).strip()

                image_url = row.get('image_url')
                if pd.isna(image_url) or not str(image_url).strip():
                    image_url = f"https://ssl-images-amazon.com{asin_clean}.jpg"
                else:
                    image_url = str(image_url).strip()

                # Helper to safely parse strings or return None
                def get_str(col_name):
                    val = row.get(col_name)
                    if pd.isna(val) or not str(val).strip():
                        return None
                    return str(val).strip()

                # Helper to safely parse numbers
                def get_float(col_name, default=None):
                    val = row.get(col_name)
                    if pd.isna(val):
                        return default
                    try:
                        return float(val)
                    except (ValueError, TypeError):
                        return default

                def get_int(col_name, default=0):
                    val = row.get(col_name)
                    if pd.isna(val):
                        return default
                    try:
                        return int(val)
                    except (ValueError, TypeError):
                        return default

                # Safely parse price, which is mandatory
                try:
                    price_val = float(row['price'])
                except (ValueError, TypeError):
                    price_val = 0.0

                gift, created = Present.objects.update_or_create(
                    asin=asin_clean,
                    defaults={
                        "title": str(row['title']).strip(),
                        "amazon_url": str(row['amazon_url']).strip(),
                        "image_url": image_url,
                        "price": price_val,
                        "original_price": get_float('original_price'),
                        "rating": get_float('rating'),
                        "reviews_count": get_int('reviews_count', 0),
                        "category": get_str('category') or "Imported Gifts",
                        "age_group": get_str('age_group'),
                        "gender_target": get_str('gender_target'),
                        "occasion": get_str('occasion'),
                        "interests": get_str('interests'),
                        "recipient": get_str('recipient'),
                        "is_available": True
                    }
                )
                if created:
                    success_count += 1

            self.stdout.write(self.style.SUCCESS(
                f"Successfully processed spreadsheet database feed! "
                f"Added {success_count} new entries with images into PostgreSQL."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Execution pipeline failure tracking error: {str(e)}"))
