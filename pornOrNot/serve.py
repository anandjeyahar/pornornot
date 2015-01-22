import greenlet
import json
import logging
from functools import partial
import os
import random
import sys
import tornado
import tornado.httpserver
from tornado.options import define, options
from tornado.web import RequestHandler, Application

sys.path.append('/home/anand/Downloads/devbox_configs/')
from fetchImgur import client as imgurClient
import backend

PORNDETECT_PREFIX = 'porn:or:not:'
F_TITS_SET = 'porn:f:tits'
S_BOOBS_SET = 'porn:s:boobs'
P_SET = 'porn:pussy'
D_SET = 'porn:dick'
A_SET = 'porn:butts'
NP_SET = 'porn:not'
logger = logging.getLogger(__name__)

define('debug', default=1, help='hot deployment. use in dev only', type=int)
define('port', default=8888, help='run on the given port', type=int)
define('imgFolder', default='images', help = 'folder to store uploaded images', type=str)

def getRandomImgUrUrl():
    yield random.choice(open('imagelist.txt', 'r').readlines())

def getImageFromImgur(url):
    # get image from imgur
    #
    image = imgurClient.get_image(imgId)
    return imgId

def processImgData(imgData):

    imgId = imgData.get('imgUrl')[0].split('/')[-1]
    #g = greenlet(getImageFromImgurl)

    if imgData.get('pornCategory') is None:
        backend.redisToGoConn.sadd(NP_SET, imgId)
    elif imgData.get('pornCategory') == 'pussy':
        backend.redisToGoConn.sadd(P_SET, imgId)
    elif imgData.get('pornCategory') == 'ass':
        backend.redisToGoConn.sadd(A_SET, imgId)
    elif imgData.get('pornCategory') == 'dick':
        backend.redisToGoConn.sadd(D_SET, imgId)
    elif imgData.get('pornCategory') == 'sideTits':
        backend.redisToGoConn.sadd(S_BOOBS_SET, imgId)
    elif imgData.get('pornCategory') == 'frontalTits':
        backend.redisToGoConn.sadd(F_TITS_SET, imgId)

class PornOrNotRenderer(RequestHandler):
    def get(self):
        return self.render('index.html', imgurUrl=getRandomImgUrUrl().next())

class PollPostHandler(RequestHandler):
    def post(self):
        assert(self.request.body_arguments.has_key('pornCategory'))
        assert(self.request.body_arguments.has_key('imgUrl'))
        processImgData(self.request.body_arguments)

class Application(Application):
    def __init__(self):
        handlers = [
                (r'/', PornOrNotRenderer),
                (r'/pollpost', PollPostHandler),
                ]
        settings = dict(
            autoescape=None,  # tornado 2.1 backward compatibility
            debug=options.debug,
            gzip=True,
            xheaders=True,

            )
        settings.update({'static_path':os.path.join(os.path.dirname(__file__), 'static')})
        settings.update({'template_path': os.path.join(os.path.dirname(__file__), 'static', 'html')})
        tornado.web.Application.__init__(self, handlers, **settings)
        if not os.path.exists(os.path.join(os.path.dirname(__file__), 'static', options.imgFolder)):
            os.makedirs(os.path.join(os.path.dirname(__file__), 'static', options.imgFolder))

def main():
    options.parse_command_line()
    App = Application()
    httpserver = tornado.httpserver.HTTPServer(App)
    httpserver.listen(port=options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
