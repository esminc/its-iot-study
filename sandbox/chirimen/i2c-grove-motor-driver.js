const SteppingMotor = function(i2cPort, slaveAddress) {
  this.i2cPort = i2cPort;
  this.i2cSlave = null;
  this.slaveAddress = slaveAddress;
  // the direction of M1 and M2 DC motor 1:clockwise  -1:anticlockwise
  this._M1_direction = 1;
  this._M2_direction = 1;
  // _speed0: 0~100  _speed1: 0~100
  this._speed1 = 0;
  this._speed2 = 0;
};

SteppingMotor.prototype = {
  //
  // Constants
  //
  /**************Prescaler Frequence***********/
  F_31372Hz:                 0x01,
  F_3921Hz:                  0x02,
  F_490Hz:                   0x03,
  F_122Hz:                   0x04,
  F_30Hz:                    0x05,
  /******I2C command definitions*************/
  MotorSpeedSet:             0x82,
  PWMFrequenceSet:           0x84,
  DirectionSet:              0xaa,
  MotorSetA:                 0xa1,
  MotorSetB:                 0xa5,
  Nothing:                   0x01,
  /**************Motor ID**********************/
  MOTOR1:                    1,
  MOTOR2:                    2,
  /**************Motor Direction***************/
  BothClockWise:             0x0a,
  BothAntiClockWise:         0x05,
  M1CWM2ACW:                 0x06,
  M1ACWM2CW:                 0x09,
  //
  // Functions
  //
  init: function() {
    return new Promise((resolve, reject) => {
      this.i2cPort.open(this.slaveAddress).then(
        async i2cSlave => {
          await this.delayMicroseconds(10000);
          this.i2cSlave = i2cSlave;
          // Set default frequence to F_3921Hz
          await this.frequence(SteppingMotor.F_3921Hz);
          console.log("init ok:" + this.i2cSlave);
          resolve();
        },
        err => {
          reject(err);
        }
      );
    });
  },

  // *****************************Private Function*******************************
  // Set the direction of 2 motors
  // _direction: M1CWM2ACW(M1 ClockWise M2 AntiClockWise), M1ACWM2CW, BothClockWise, BothAntiClockWise, 
  direction: function(_direction)
  {
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave == null) {
        reject("i2cSlave Address does'nt yet open!");
      } else {
        await this.i2cSlave.write16(SteppingMotor.DirectionSet, _direction * 0x100 + SteppingMotor.Nothing);
        await this.delayMicroseconds(4000);
        resolve();
      }
    });
  },
  
  // *****************************DC Motor Function******************************
  // Set the speed of a motor, speed is equal to duty cycle here
  // motor_id: MOTOR1, MOTOR2
  // _speed: -100~100, when _speed>0, dc motor runs clockwise; when _speed<0, 
  // dc motor runs anticlockwise
  speed: function(motor_id, _speed) {
    if (motor_id < SteppingMotor.MOTOR1 || motor_id > SteppingMotor.MOTOR2) {
      console.log("Motor id error! Must be MOTOR1 or MOTOR2");
      return;
    }

    if(motor_id == SteppingMotor.MOTOR1) {
      if (_speed >= 0) {
        this._M1_direction = 1; 
        _speed = _speed > 100 ? 100 : _speed;
        this._speed1 = this.map(_speed, 0, 100, 0, 255);
      }
      else if (_speed < 0) {
        this._M1_direction = -1;
        _speed = _speed < -100 ? 100 : -(_speed);
        this._speed1 = this.map(_speed, 0, 100, 0, 255);
      }
    }
    else if(motor_id == MOTOR2) {
      if (_speed >= 0) {
        this._M2_direction = 1;
        _speed = _speed > 100 ? 100 : _speed;
        this._speed2 = this.map(_speed, 0, 100, 0, 255);
      }
      else if (_speed < 0) {
        this._M2_direction = -1;
        _speed = _speed < -100 ? 100 : -(_speed);
        this._speed2 = this.map(_speed, 0, 100, 0, 255);
      }
    }
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave == null) {
        reject("i2cSlave Address does'nt yet open!");
      } else {
        // Set the direction
        if (this._M1_direction == 1 && this._M2_direction == 1) await this.direction(SteppingMotor.BothClockWise);
        if (this._M1_direction == 1 && this._M2_direction == -1) await this.direction(SteppingMotor.M1CWM2ACW);
        if (this._M1_direction == -1 && this._M2_direction == 1) await this.direction(SteppingMotor.M1ACWM2CW);
        if (this._M1_direction == -1 && this._M2_direction == -1) await this.direction(SteppingMotor.BothAntiClockWise);
        // send command
        await this.i2cSlave.write16(SteppingMotor.MotorSpeedSet, this._speed1 * 0x100 + this._speed2);
        await delayMicroseconds(4000);
        resolve();
      }
    });
  },

  // Set the frequence of PWM(cycle length = 510, system clock = 16MHz)
  // F_3921Hz is default
  // _frequence: F_31372Hz, F_3921Hz, F_490Hz, F_122Hz, F_30Hz
  frequence: function(_frequence) {
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave == null) {
        reject("i2cSlave Address does'nt yet open!");
      } else if (_frequence < SteppingMotor.F_31372Hz || _frequence > SteppingMotor.F_30Hz) {
        reject("frequence error! Must be F_31372Hz, F_3921Hz, F_490Hz, F_122Hz, F_30Hz");
      } else {
        await this.i2cSlave.write16(SteppingMotor.PWMFrequenceSet, _frequence * 0x100 + SteppingMotor.Nothing);
        await this.delayMicroseconds(4000);
        resolve();
      }
    });
  },

  // Stop one motor
  // motor_id: MOTOR1, MOTOR2
  stop: function (motor_id) {
    if (motor_id<SteppingMotor.MOTOR1 || motor_id>SteppingMotor.MOTOR2) {
      Serial.println("Motor id error! Must be MOTOR1 or MOTOR2");
      return;
    }
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave == null) {
        reject("i2cSlave Address does'nt yet open!");
      } else {
        await this.speed(motor_id, 0);
        resolve();
      }
    });
  },

  // ***************************Stepper Motor Function***************************
  // Drive a stepper motor
  // _step: -1024~1024, when _step>0, stepper motor runs clockwise; when _step<0, 
  // stepper motor runs anticlockwise; when _step is 512, the stepper motor will 
  // run a complete turn; if step is 1024, the stepper motor will run 2 turns.
  //  _type: 0 -> 4 phase stepper motor, default
  //         1 -> 2 phase stepper motor
  stepperRun: function(_step, _type) {
    let _direction = 1;
    if (_step > 0) {
      _direction = 1; //clockwise
      _step = _step > 1024 ? 1024 : _step;
    } else if (_step < 0) {
      _direction = -1; //anti-clockwise
      _step = _step < -1024 ? 1024 : -(_step);
    }
    this._speed1 = 255;
    this._speed2 = 255;

    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave == null) {
        reject("i2cSlave Address does'nt yet open!");
      } else {
        await this.i2cSlave.write16(SteppingMotor.MotorSpeedSet, this._speed1 * 0x100 + this._speed2);
        await this.delayMicroseconds(4000);

        if (_type == 1) {
          if (_direction == 1) {				// 2 phase motor
            for (var i=0; i<_step; i++) {
              await this.direction(0b0001);
              await this.direction(0b0101);
              await this.direction(0b0100);
              await this.direction(0b0110);
              await this.direction(0b0010);
              await this.direction(0b1010);
              await this.direction(0b1000);
              await this.direction(0b1001);
            }
          }
          else if (_direction == -1) {
            for (var i=0; i<_step; i++) {
              await this.direction(0b1000);
              await this.direction(0b1010);
              await this.direction(0b0010);
              await this.direction(0b0110);
              await this.direction(0b0100);
              await this.direction(0b0101);
              await this.direction(0b0001);
              await this.direction(0b1001);
            }
          }
        }
        else if (_type == 0)
        {
          if (_direction == 1) {				// 4 phase motor
            for (var i=0; i<_step; i++) {
              await this.direction(0b0001);
              await this.direction(0b0011);
              await this.direction(0b0010);
              await this.direction(0b0110);
              await this.direction(0b0100);
              await this.direction(0b1100);
              await this.direction(0b1000);
              await this.direction(0b1001);
            }
          }
          else if (_direction == -1) {
            for (var i=0; i<_step; i++) {
              await this.direction(0b1000);
              await this.direction(0b1100);
              await this.direction(0b0100);
              await this.direction(0b0110);
              await this.direction(0b0010);
              await this.direction(0b0011);
              await this.direction(0b0001);
              await this.direction(0b1001);
            }
          }
        }
        resolve();
      }
    });
  },
    
  delayMicroseconds: function(microseconds) {
    return new Promise(resolve => setTimeout(resolve, microseconds / 1000));
  },

  map: function(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

};
