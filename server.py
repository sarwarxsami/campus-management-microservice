#!/usr/bin/env python3
"""
Simple HTTP server to serve both frontends on port 3333
No modifications to any HTML or JS files
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class FrontendHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path
        
        # Login service
        if path == '/login/' or path == '/login':
            self.path = '/login-service/login-frontend/index.html'
        # Search service
        elif path == '/search/' or path == '/search':
            self.path = '/search-service/search-frontend/index.html'
        
        # Everything else serves files as-is from current directory
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    port = 3333
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"🚀 Serving on port {port}")
    print(f"   Login:  http://localhost:{port}/login/")
    print(f"   Search: http://localhost:{port}/search/")
    print("Press Ctrl+C to stop")
    
    HTTPServer(('', port), FrontendHandler).serve_forever()
