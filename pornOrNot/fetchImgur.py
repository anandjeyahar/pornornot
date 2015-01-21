from imgurpython import ImgurClient
import random

client_id = '39f4394b33b9d9a'
client_secret = '298b3b7541a230238eedc1b04164882e163a4516'

client = ImgurClient(client_id, client_secret)

# Example request
items = client.gallery()
for item in items:
        print(item.link)
