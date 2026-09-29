import os
import pandas as pd
from django.core.management.base import BaseCommand
from presents.models import Present


class Command(BaseCommand):
    help = "Loads gift listings from an Excel table into the database."

    def add_arguments(self, parser):
        parser.add_argument("excel_file", type=str, help="Relative path to the Excel file")

    def handle(self, *args, **options):
        file_path = options["excel_file"]

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        try:
            df = pd.read_excel(file_path)
            df.columns = [str(c).lower().strip() for c in df.columns]

            created_count = 0
            updated_count = 0

            for _, row in df.iterrows():
                if pd.isna(row.get("asin")) or pd.isna(row.get("title")):
                    continue

                asin = str(row["asin"]).strip()

                def clean_val(col_name, default=""):
                    val = row.get(col_name)
                    return str(val).strip() if pd.notna(val) else default

                def clean_float(col_name, default=0.0):
                    val = row.get(col_name)
                    try:
                        return float(val) if pd.notna(val) else default
                    except (ValueError, TypeError):
                        return default

                def clean_int(col_name, default=0):
                    val = row.get(col_name)
                    try:
                        return int(val) if pd.notna(val) else default
                    except (ValueError, TypeError):
                        return default

                _, created = Present.objects.update_or_create(
                    asin=asin,
                    defaults={
                        "title": clean_val("title"),
                        "description": clean_val("description"),
                        "amazon_url": clean_val("amazon_url"),
                        "image_url": clean_val("image_url", f"https://ssl-images-amazon.com{asin}.jpg"),
                        "price": clean_float("price", 0.0),
                        "rating": clean_float("rating", 0.0),
                        "reviews_count": clean_int("reviews_count", 0),
                        "budget_bracket": clean_val("budget_bracket"),
                        "recipient": clean_val("recipient"),
                        "relationship": clean_val("relationship"),
                        "interest": clean_val("interest"),
                        "occasion": clean_val("occasion"),
                        "is_available": True,
                    }
                )

                if created:
                    created_count += 1
                else:
                    updated_count += 1

            self.stdout.write(self.style.SUCCESS(
                f"Import complete: {created_count} created, {updated_count} updated."
            ))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to import file: {e}"))