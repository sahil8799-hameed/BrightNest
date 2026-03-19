console.log("Script connected successfully");
const socket = io();

// Room aur user ID
const ROOM_ID = "my-room";
const USER_ID = Math.floor(Math.random() * 1000);

const peers = {}; // store all peer connections

// Get local video/audio
const localVideo = document.createElement("video");
localVideo.muted = true;
document.body.appendChild(localVideo);

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localVideo.srcObject = stream;
    localVideo.play();

    // Join room
    socket.emit("join-room", ROOM_ID, USER_ID);

    // New user joined
    socket.on("user-connected", (userId) => {
      console.log("User connected: " + userId);
      connectToNewUser(userId, stream);
    });

    // User disconnected
    socket.on("user-disconnected", (userId) => {
      console.log("User disconnected: " + userId);
      if (peers[userId]) {
        peers[userId].close();
        delete peers[userId];
        const video = document.getElementById("video-" + userId);
        if (video) video.remove();
      }
    });

    // WebRTC signaling handlers
    socket.on("offer", async (data) => {
      const peer = createPeerConnection(data.from, stream);
      peers[data.from] = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { to: data.from, sdp: answer });
    });

    socket.on("answer", async (data) => {
      const peer = peers[data.from];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    });

    socket.on("ice-candidate", async (data) => {
      const peer = peers[data.from];
      if (peer) {
        try { await peer.addIceCandidate(data.candidate); } catch(e) { console.error(e); }
      }
    });

  })
  .catch(err => console.error(err));

// Create new peer and send offer
function connectToNewUser(userId, stream) {
  const peer = createPeerConnection(userId, stream);
  peers[userId] = peer;

  peer.createOffer()
    .then(offer => peer.setLocalDescription(offer))
    .then(() => {
      socket.emit("offer", { to: userId, sdp: peer.localDescription });
    });
}

// Create PeerConnection and handle tracks
function createPeerConnection(userId, stream) {
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" } // Google STUN server
    ]
  });

  // Add local tracks
  stream.getTracks().forEach(track => peer.addTrack(track, stream));

  // Create remote video element
  const remoteVideo = document.createElement("video");
  remoteVideo.id = "video-" + userId;
  document.body.appendChild(remoteVideo);

  peer.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.play();
  };

  // Send ICE candidates to remote peer
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { to: userId, candidate: event.candidate });
    }
  };

  return peer;
}
