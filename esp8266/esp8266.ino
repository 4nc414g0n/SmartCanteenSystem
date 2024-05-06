#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <string>  
#include <SoftwareSerial.h>
#include <Servo.h>
#include "osapi.h"
using namespace std;

#define SERVER_IP "47.100.50.78:8081" // PC address with emulation on host
#define SERVER_IP1 "47.100.50.78:8082" // PC address with emulation on host
//#define SERVER_IP "192.168.1.42"
#ifndef STASSID
#define STASSID "fucku"
#define STAPSK "1234567890"
//#define STAPSK "18250339611"
#endif                     //String大写首字母

//esp8266的post (只要舵机)
Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
//舵机定时器
unsigned long previousMillis = 0; 
const long interval = 1000; // Interval time in milliseconds

String espRqstJson = "{\"request\":\"esp8266\"}";
String servoStr = "";


int Stm32RecvOK = 0;   //接收完成
//从stm32获取指令rqst来post
String stm32Rqst = "";
//将stm32Rqst拆分为 recvCode和requestJson
String recvCode = "";    //rqst
String requestJson = ""; //{\"request\":\"stm32_mysql\",\"user_id\":\"12343253611\",\"moneyType\":\"card\",\"moneySum\":\"1.2908\"}
//收到http返回
String responseJson = "";
String blankresponseJson = " ";
//不断发送可能失败（对于stm32的post请求必须发送直到收到正确返回未知）

SoftwareSerial MySerial(0, 5); //RX D3 0 / TX D1 5
os_timer_t timer;

void receiveDataISR() { //串口中断函数
  while (MySerial.available()) {
    char data = MySerial.read();
    stm32Rqst += data;
    if(data == 0x0D) Stm32RecvOK = 1;
    //delay(2);
  }
}

void setup() {

  Serial.begin(9600);
  //Config conf = Config::SWSERIAL_8N1; //数据位为8位、无校验位、停止位为1位的串口通信格式
  MySerial.begin(9600);
  MySerial.listen();
  os_timer_setfn(&timer, (os_timer_func_t *)receiveDataISR, NULL);
  os_timer_arm(&timer, 50, true); // 每50ms触发一次定时中断
  //attachInterrupt(digitalPinToInterrupt(0), receiveDataISR, CHANGE); // 在引脚0（RX）上附加中断
  //Serial.println("GPIO15(TX),GPIO13(RX)"); //调用映射方法 
  //Serial.swap();  

  servo1.attach(14); // 舵机D5口
  servo2.attach(12); // 舵机D6口
  servo3.attach(13); // 舵机D7口
  servo4.attach(15); // 舵机D8口
  servo1.write(1);
  servo2.write(1);
  servo3.write(1);
  servo4.write(1);

  WiFi.mode(WIFI_STA);    // STA模式 即连接模式
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    //Serial.print("waiting for connection");
  }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  //舵机定时回到1°
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    // Toggle between 90 and 180 degrees every second
    if (servo1.read() == 180) servo1.write(1);
    if (servo2.read() == 180) servo2.write(1);
    if (servo3.read() == 180) servo3.write(1);
    if (servo4.read() == 180) servo4.write(1);
  }
  //舵机定时回到1°
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) 
  {

    WiFiClient client;
    HTTPClient http;
    HTTPClient http1;

    //Serial.print("[HTTP] begin...\n");
    // configure traged server and url
    http.begin(client, "http://" SERVER_IP "/json");  // HTTP
    http.addHeader("Content-Type", "application/json");
    http1.begin(client, "http://" SERVER_IP1 "/json");  // HTTP
    http1.addHeader("Content-Type", "application/json");

    if(Stm32RecvOK == 1) //stm32发送请求
    {
      //拆分stm23请求
      //for(int i=0;i<4;i++) recvCode+=stm32Rqst[i];
      int i = 0;
      while(stm32Rqst[i]!=0x0D)
        requestJson += stm32Rqst[i++];
      Serial.println(requestJson);
      //http请求开始
      int httpCode = http.POST(requestJson);
      //Serial.print("[HTTP] POST...\n");
      while(httpCode < -1) //不断尝试直到连接服务器成功
        httpCode = http.POST(requestJson);
      if (httpCode > 0) 
      {
        // HTTP header has been send and Server response header has been handled
        //Serial.printf("[HTTP] POST... code: %d\n", httpCode);
        // file found at server
        if (httpCode == HTTP_CODE_OK) 
        {
          responseJson = http.getString();
          //esp8266截取Servo部分
          DynamicJsonDocument doc(200);
          deserializeJson(doc, responseJson);
          JsonObject obj = doc.as<JsonObject>();
          servoStr = obj["servo"].as<String>();
          //esp8266截取Servo部分
          Serial.println(servoStr);
          Serial.println("received payload:\n<<");
          Serial.println(responseJson);
          Serial.println(">>");
        }
      }
      //发送数据回stm32
      //MySerial.println(stm32Rqst.length());
      //for (int i = 0; i < stm32Rqst.length(); i++) 
      blankresponseJson += responseJson;
      MySerial.println(blankresponseJson);
      //MySerial.println(0x0D); // 发送回车符
      //复位
      recvCode = "";
      stm32Rqst = "";
      requestJson = "";
      responseJson = "";
      blankresponseJson = " ";
      Stm32RecvOK = 0;
      //复位
    }
    //MySerial.println("Test\r\n");
    //Serial.println("test\r\n");
    else
    {
      //http请求开始
      int httpCode = http1.POST(espRqstJson);
      while(httpCode < -1) 
        httpCode = http1.POST(espRqstJson);
      if (httpCode > 0) 
      {
        // HTTP header has been send and Server response header has been handled
        //Serial.printf("[HTTP] POST... code: %d\n", httpCode);
        // file found at server
        if (httpCode == HTTP_CODE_OK) 
        {
          const String& payload = http1.getString();
          //esp8266截取Servo部分
          DynamicJsonDocument doc(200);
          deserializeJson(doc, payload);
          JsonObject obj = doc.as<JsonObject>();
          servoStr = obj["servo"].as<String>();
          //esp8266截取Servo部分
          Serial.println(servoStr);
          Serial.println("received payload:\n<<");
          Serial.println(payload);
          Serial.println(">>");
        }
      }
     //delay(400);
    }
    //操作舵机
    for(int i = 0;i<servoStr.length();i++)
    {
      if(servoStr[i] == '1') servo1.write(180);
      if(servoStr[i] == '2') servo2.write(180);
      if(servoStr[i] == '3') servo3.write(180);
      if(servoStr[i] == '4') servo4.write(180);
      //if(e == "4") servo4.write(180);
    }
    if(servoStr!=""){
      int httpCode = http.POST("{\"request\":\"done\"}");
      while(httpCode < -1) 
        httpCode = http.POST("{\"request\":\"done\"}");
    }
    servoStr = "";
    http.end();
  }
  
}


