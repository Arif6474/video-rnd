import VideoPlayer from "@/components/VideoPlayer"

export default function Video() {
  const videoSources = [
    {
      label: "1080p HD",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4",
    },
    {
      label: "720p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      type: "video/mp4",
    },
    {
      label: "540p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      type: "video/mp4",
    },
    {
      label: "480p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "video/mp4",
    },
    {
      label: "360p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      type: "video/mp4",
    },
  ]

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">


          <div className="max-w-[800px] mx-auto">
            <VideoPlayer sources={videoSources} title="Test Course Video" />
          </div>

        </div>
      </div>
    </main>
  )
}
