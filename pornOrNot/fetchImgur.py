from imgurpython import ImgurClient
import random


client_id = '39f4394b33b9d9a'
client_secret = '298b3b7541a230238eedc1b04164882e163a4516'

client = ImgurClient(client_id, client_secret)

def fetchImageLists():
    pornPics = list()
    allPics = list()
    pornReddits = ['gonewild',
                    'dykesgonewild']
    generalTrendingPics = client.gallery(section='hot', sort='viral', page=0, window='day')
    for subreddit in pornReddits:
        pornPics += client.subreddit_gallery(subreddit, sort='top', page=0, window='day')

    allPics.extend(generalTrendingPics)
    allPics.extend(pornPics)
    # filter out only .jpg images
    allJpegs = [x for x in allPics  if x.link.split('.')[-1] in ['jpg', 'jpeg', 'png']]
    with open('imagelist.txt', 'ab') as out_fd:
        for item in generalTrendingPics:
           out_fd.write(item.link + '\n')


if __name__ == '__main__':
    fetchImageLists()
