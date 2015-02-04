from imgurpython import ImgurClient
import random


client_id = '39f4394b33b9d9a'
client_secret = '298b3b7541a230238eedc1b04164882e163a4516'

client = ImgurClient(client_id, client_secret)

def fetchImageLists():
    pornPics = list()
    allPics = list()
    pornReddits = ['gonewild',
                    'dykesgonewild',
                    'ladybonersgw',
                    'gonemild',
                    'dykesgonemild',
                    'ladyboners'
                    ]
    generalTrendingPics = client.gallery(section='hot', sort='viral', page=0, window='day')
    for subreddit in pornReddits:
        pornPics += client.subreddit_gallery(subreddit, sort='top', page=0, window='day')

    allPics.extend(generalTrendingPics)
    allPics.extend(pornPics)
    # filter out only .jpg images

    allValidImages = [x.link for x in allPics  if x.link.split('.')[-1] in ['jpg', 'jpeg', 'png', 'tif']]
    with open('imagelist.txt', 'r') as inp_fd:
        currentImages = [link.strip('\n') for link in inp_fd.readlines()]
    with open('imagelist.txt', 'ab') as out_fd:
        for item in set(allValidImages) - set(currentImages):
           out_fd.write(item + '\n')


if __name__ == '__main__':
    fetchImageLists()
