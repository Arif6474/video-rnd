"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronUp } from "lucide-react"

const VideoPlayer = ({ sources, title, ...props }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false)
  const [showQualityDropdown, setShowQualityDropdown] = useState(false)
  const [currentResolution, setCurrentResolution] = useState(0)

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

  const videoSources = sources || [
    {
      label: "1080p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4",
    },
    {
      label: "720p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      type: "video/mp4",
    },
    {
      label: "480p",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "video/mp4",
    },
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleError = (e) => {
      console.log("[v0] Video error:", e)
      console.log("[v0] Video error details:", video.error)
    }

    const handleCanPlay = () => {
      console.log("[v0] Video can play")
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("error", handleError)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("error", handleError)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
  }

  const handleVolumeChange = (e) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    video.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const changePlaybackRate = (rate) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSpeedDropdown(false)
  }

  const changeResolution = (index) => {
    const video = videoRef.current
    if (!video) return

    const wasPlaying = !video.paused
    const currentTimeStamp = video.currentTime

    setCurrentResolution(index)

    // Load new source
    video.src = videoSources[index].src
    video.load()

    // Restore playback position and state
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = currentTimeStamp
        if (wasPlaying) {
          video.play()
        }
      },
      { once: true },
    )

    setShowQualityDropdown(false)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {title && <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>}

      <div
        className="relative bg-black rounded-lg overflow-hidden group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          className="w-full h-auto"
          preload="metadata"
          crossOrigin="anonymous"
          onClick={togglePlay}
          controls={false}
          src={videoSources[currentResolution].src}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-center h-64 text-white text-lg">
            Your browser does not support the video tag.
          </div>
        </video>

        {/* Custom Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer" onClick={handleSeek}>
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              {/* Volume Controls */}
              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSpeedDropdown(!showSpeedDropdown)
                    setShowQualityDropdown(false)
                  }}
                  className="text-white hover:text-blue-400 transition-colors flex items-center space-x-1 text-sm"
                >
                  <span>{playbackRate}x</span>
                  <ChevronUp
                    size={16}
                    className={`transform transition-transform ${showSpeedDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showSpeedDropdown && (
                  <div className="absolute bottom-8 right-0 bg-black/90 rounded-lg p-2 min-w-20">
                    <div className="text-white text-xs mb-2 font-medium">Speed</div>
                    {playbackRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded mb-1 ${
                          playbackRate === rate ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowQualityDropdown(!showQualityDropdown)
                    setShowSpeedDropdown(false)
                  }}
                  className="text-white hover:text-blue-400 transition-colors flex items-center space-x-1 text-sm"
                >
                  <span>{videoSources[currentResolution].label}</span>
                  <ChevronUp
                    size={16}
                    className={`transform transition-transform ${showQualityDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showQualityDropdown && (
                  <div className="absolute bottom-8 right-0 bg-black/90 rounded-lg p-2 min-w-24">
                    <div className="text-white text-xs mb-2 font-medium">Quality</div>
                    {videoSources.map((source, index) => (
                      <button
                        key={index}
                        onClick={() => changeResolution(index)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded mb-1 ${
                          currentResolution === index ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {source.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
