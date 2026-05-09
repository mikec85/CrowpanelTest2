import mqtt, { MqttClient } from 'mqtt';

class MQTTService {
  private client: MqttClient | null = null;
  private readonly brokerUrl = 'wss://broker.emqx.io:8084/mqtt'; // Public WebSocket broker

  connect(onMessage: (topic: string, message: string) => void) {
    if (this.client) return;

    this.client = mqtt.connect(this.brokerUrl);

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      this.client?.subscribe(['home/alarm/status', 'home/devices/#', 'home/camera/feed']);
    });

    this.client.on('message', (topic, message) => {
      onMessage(topic, message.toString());
    });
  }

  publish(topic: string, message: string) {
    if (!this.client) {
      console.warn('MQTT Client not connected');
      return;
    }
    this.client.publish(topic, message);
  }

  disconnect() {
    this.client?.end();
    this.client = null;
  }
}

export const mqttService = new MQTTService();
