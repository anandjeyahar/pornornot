##
# Code to transform a given image into local features and return the transformed image

import pyhog
import pyvision as pv
import pyvision.face.CascadeDetector as cd
import pyvision.face.FilterEyeLocator as ed

def facedetect():
    faceDetector = cd.CascadeDetector()
    eyeDetector  = ed.FilterEyeLocator()

    im = pv.Image("testImage.jpg", bw_annotate=True)
    faces = faceDetector(im)
    eyes =  eyeDetector(im, faces )
    for face, eye1, eye2 in eyes:
        im.annotatePolygon(face.asPolygon(), width=4)
        im.annotatePoints([eye1, eye2])

    im.show(delay=0)

def main():
    im = pv.Image("testImage.jpg")
    pyhog.
if __name__ == '__main__':
    main()


