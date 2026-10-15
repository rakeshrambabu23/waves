"""Usage: python set-site-url.py https://your-live-site.com/
Replaces the SITE_URL placeholder in every page, sitemap.xml and robots.txt."""
import sys,glob
u=sys.argv[1].rstrip('/')+'/'
for f in glob.glob('*.html')+['sitemap.xml','robots.txt']:
    s=open(f,encoding='utf-8').read(); open(f,'w',encoding='utf-8').write(s.replace('https://SITE_URL/',u))
print('Done:',u)
