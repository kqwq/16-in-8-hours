from pytube import YouTube
from flask import Flask, send_file
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from waitress import serve


def get_video(id):
  print("Downloading video..." + id)
  yt = YouTube("https://www.youtube.com/watch?v=" + id)
  if (yt.length > 60):
    print("Video is greater than 60 seconds, please try again")
    return {
      "status": "error",
      "message": "Video is greater than 60 seconds, please try again"
    }
  ys = yt.streams.get_highest_resolution()
  ys.download(filename="video.mp4")
  return send_file("./video.mp4", mimetype="video/mp4")


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
        parser = reqparse.RequestParser()
        parser.add_argument('id')
        args = parser.parse_args()
        return get_video(args['id'])

api.add_resource(Base, '/')
api.add_resource(HelloWorld, '/yt')

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000)