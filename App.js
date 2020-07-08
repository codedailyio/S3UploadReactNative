import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export const getBlob = async (fileUri) => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

export const uploadImage = async (uploadUrl, data) => {
  const imageBody = await getBlob(data);

  return fetch(uploadUrl, {
    method: "PUT",
    body: imageBody,
  });
};

const requestUpload = async () => {
  return fetch("http://localhost:3000");
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const camera = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const captureImage = async () => {
    if (camera.current) {
      let photo = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      const res = await requestUpload();
      const data = await res.json();
      await uploadImage(data.url, photo.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={camera}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center",
            }}
            onPress={() => {
              captureImage();
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              Click
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
