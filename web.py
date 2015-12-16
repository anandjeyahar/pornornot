import bottle

@bottle.post('/isboob/')
def isboob():
    # pass parameters for angles (frontal/side)
    pass

@bottle.post('/ispussy')
def ispussy():
    # pass parameters for angles (frontal/back)
    pass

@bottle.post('/isass')
def isass():
    # pass parameters for angles (frontal/side)
    pass

@bottle.post('/isdick')
def isdick():
    pass


@bottle.get('/picsadmin')
def admin_pics():
    # Show al the pics uploaded by this account and not reviewed by admin
    pass

@bottle.post('/picsadmin')
def admin_pics():
    # Marke the pics as classified by admin
    # boobs (frontal/side)
    # ass (frontal/side)
    # pussy
    # dick (fronta/side??)
    pass
