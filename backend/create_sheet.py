import pandas as pd

# Define a clean dataset with real Amazon ASIN examples
data = {
    'title': [
        'Logitech G PRO X Superlight Mouse',
        'Mechanical Gaming Keyboard',
        'Amazon Echo Dot Smart Speaker'
    ],
    'asin': ['B08N5LNXCZ', 'B07ZPKZSSC', 'B09B8V1VHC'],
    'amazon_url': [
        'https://amazon.com',
        'https://amazon.com',
        'https://amazon.com'
    ],
    'price': [129.99, 79.50, 49.99],
    'category': ['Computers', 'Computers', 'Electronics']
}

df = pd.DataFrame(data)
df.to_excel('gifts_data.xlsx', index=False)
print("Excel sheet 'gifts_data.xlsx' successfully created in your project root!")
