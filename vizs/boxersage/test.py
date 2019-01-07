import httplib2

def getContentLocation(link):
    h = httplib2.Http(".cache_httplib")
    h.follow_all_redirects = True
    resp = h.request(link, "GET")[0]
    print resp
    contentLocation = resp['content-location']
    return contentLocation

if __name__ == '__main__':
    link = 'http://podcast.at/podcast_url344476.html'
    print getContentLocation(link)

