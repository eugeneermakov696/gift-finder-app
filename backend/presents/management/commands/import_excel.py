import os
import pandas as pd
from django.core.management.base import BaseCommand
from presents.models import Present


class Command(BaseCommand):
    help = 'Loads and streams Amazon gift listings from an Excel table directly into PostgreSQL'

    def add_arguments(self, parser):
        # Allow passing the target excel file path as a terminal flag parameter
        parser.add_argument('excel_file', type=str, help='The relative path to the Excel file inside the container')

    def handle(self, *args, **options):
        file_path = options['excel_file']

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File tracking target missing at path: {file_path}"))
            return

        try:
            # 1. Parse spreadsheet columns using pandas
            self.stdout.write(f"Parsing spreadsheet layout from target source: {file_path}")
            df = pd.read_excel(file_path)

            # Ensure all column text sequences match model specs cleanly
            df.columns = [c.lower().strip() for c in df.columns]

            required_columns = ['title', 'asin', 'amazon_url', 'price']
            for col in required_columns:
                if col not in df.columns:
                    self.stderr.write(self.style.ERROR(f"Missing required target header column: '{col}'"))
                    return

            success_count = 0

            # 2. Iterate through rows and upsert records into PostgreSQL
            for _, row in df.iterrows():
                # Skip row frames if missing mandatory key properties
                if pd.isna(row['asin']) or pd.isna(row['title']):
                    continue

                gift, created = Present.objects.update_or_create(
                    asin=str(row['asin']).strip(),
                    defaults={
                        "title": str(row['title']).strip(),
                        "amazon_url": str(row['amazon_url']).strip(),
                        "price": float(row['price']),
                        "category": str(row.get('category', 'Imported Gifts')).strip() if not pd.isna(
                            row.get('category')) else "Imported Gifts",
                        "is_available": True
                    }
                )
                if created:
                    success_count += 1

            self.stdout.write(self.style.SUCCESS(
                f"Successfully processed spreadsheet database feed! Added {success_count} new entries into PostgreSQL."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Execution pipeline failure tracking error: {str(e)}"))
