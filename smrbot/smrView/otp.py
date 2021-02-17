import math, random
  
def gen_otp():
    string = '0123456789'
    OTP = "" 
    varlen= len(string)
    for i in range(6) : 
        OTP += string[math.floor(random.random() * varlen)]
    
    return (OTP)