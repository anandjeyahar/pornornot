##
# Code to transform a given image into local features and return the transformed image
import Image
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
    import pdb;pdb.set_trace()
    im =Image.open("testImage.jpg")
    hogbin = pyhog.features_pedro(im, 20)
    pyhog.hog_picture(hogbin)
if __name__ == '__main__':
    main()


