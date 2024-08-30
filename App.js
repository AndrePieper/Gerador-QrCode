import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [jsonContent, setJsonContent] = useState('');

  // Função para buscar o QR Code e JSON
  const fetchQRCodeAndContent = async () => {
    try {
      console.log('Fazendo requisição para o servidor...');
      const response = await fetch('http://192.168.0.17:3000/jsonQR'); // IP
      const data = await response.json();
      console.log('Dados recebidos do servidor:', data);

      setQrCodeValue(JSON.stringify(data));
      setJsonContent(JSON.stringify(data.jsonContent, null, 2));
    } catch (error) {
      console.log(error)
      console.error('Erro ao buscar QR Code e conteúdo JSON:', error);
    }
  };

  // Executa a função ao carregar o app
  useEffect(() => {
    console.log('Componente montado. Iniciando fetch inicial...');
    fetchQRCodeAndContent();
    const interval = setInterval(fetchQRCodeAndContent, 10000); // Atualiza a cada 10 segundos
    console.log('Intervalo para atualização configurado.');

    return () => {
      console.log('Componente desmontado. Limpando intervalo.');
      clearInterval(interval); // Limpa o intervalo quando o componente desmontar
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.qrContainer}>
        {qrCodeValue ? (
          <QRCode
            value={qrCodeValue}
            size={200}
            backgroundColor="white"
            color="black"
          />
        ) : (
          <Text>Carregando QR Code...</Text>
        )}
      </View>
      <Text style={styles.jsonText}>{jsonContent}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  qrContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  jsonText: {
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    whiteSpace: 'pre-wrap',
    color: '#333',
    maxWidth: '100%',
    wordWrap: 'break-word',
  },
});
