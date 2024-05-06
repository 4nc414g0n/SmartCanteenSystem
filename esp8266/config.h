

//esp8266(stm32)
// typedef struct _requestJson
// {
//     String request = "stm32_mysql";//请求来自（esp8266 stm32 miniapp）stm32_mysql/esp8266
//     String id;                        //持卡人id
//     String moneyType;                 //RFID or QR
//     float moneySum;                  //需要的总金额
// }requestJson;
// //{"request":"stm32_mysql","id":"45678907987","moneyType":"card","moneySum":"20"}

// typedef struct _responseJson
// {
//     String servo;                 //舵机模拟门锁(1\2\3\4)0表示无
//     bool has_id;                   //是否有此人
//     bool has_money;                //是否还有剩余的钱
//     string name;                   //持卡人
//     int leftmoney;                 //剩下的金额
//     bool queryOK = false;
// }responseJson;
//{"servo":"0","has_id":"1","has_money":"1","name":"张三","leftmoney":"100"}


//String jsonSerialization(requestJson &rqst);
//void jsonDeserialization(String &s);








