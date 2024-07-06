import React, {useState, useEffect, useRef} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';

const App = () => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<RNCamera>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de camara ',
            message: 'Se necesita el permiso.',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancelar',
          },
        );
        setCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setCameraPermission(true); // Asumiendo que en iOS siempre se otorgan los permiso
      }
    };

    requestCameraPermission();
  }, []);

  const activateCamera = () => {
    if (cameraPermission) {
      setIsCameraActive(true);
    }
  };

  const renderCamera = () => {
    if (cameraPermission === null) {
      return <Text>Requiere permiso...</Text>;
    } else if (cameraPermission === false) {
      return (
        <Text>
          Permiso de cámara denegado. Por favor conceda permiso en
          Configuración.
        </Text>
      );
    }

    if (isCameraActive) {
      return (
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}>
          <Button
            title="Tomar Foto"
            onPress={() => takePicture()}
            disabled={!cameraPermission}
          />
        </RNCamera>
      );
    }

    return null; // No renderizar la cámara si no está activa
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setPhotoUri(data.uri); // Guardar la URI de la foto
      setIsCameraActive(false); // Desactivar la cámara después de tomar la foto
    }
  };

  return (
    <View style={styles.container}>
      {renderCamera()}
      {!isCameraActive && (
        <Button title="Activar Camara" onPress={activateCamera} />
      )}
      {photoUri && (
        <View style={styles.photoContainer}>
          <Text>Foto:</Text>
          <Image source={{uri: photoUri}} style={styles.photo} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  photoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default App;
