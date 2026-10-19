"""Servidor local per provar el joc: python serveix.py  ->  http://localhost:8000/
(sense memòria cau, perquè els canvis es vegin sempre en recarregar)"""
import http.server, socketserver

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('', 8000), Handler) as s:
    print('Joc a http://localhost:8000/')
    s.serve_forever()
