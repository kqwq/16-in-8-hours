from pytube import YouTube
from flask import Flask, send_file
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import ssl
import os
ssl._create_default_https_context = ssl._create_unverified_context

def get_video(id):
  print("Downloading video..." + id)
  yt = YouTube("https://www.youtube.com/watch?v=" + id)
  video = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
  video.download( filename = id+".mp4" )
  return send_file(id + '.mp4', mimetype='video/mp4')


app = Flask(__name__)
api = Api(app)
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})



class Base(Resource):
  def get(self):
    return {
      "status": "success",
      "message": "Welcome to the YouTube downloader"
    }
    

class HelloWorld(Resource):
    def get(self):
        # Get ID argument from URL
        parser = reqparse.RequestParser() 
        parser.add_argument("id", type=str)
        args = parser.parse_args()
        id = args["id"]
        print("ID: " + id)
        return get_video(id)

api.add_resource(Base, '/')
api.add_resource(HelloWorld, '/yt')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)