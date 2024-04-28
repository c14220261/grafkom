var LIBS = {
 
  degToRad: function(angle){


    return(angle*Math.PI/180);


  },
  translate: function(m, v){
    m[12]+=v[0];
    m[13]+=v[1];
    m[14]+=v[2];
},
get_translation: function(m) {
  return [m[12], m[13], m[14]];
},


multiply: function(m1,m2){
  res = this.get_I4();
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      res[i*4+j] = 0;
      for(var k=0;k<4;k++){
        res[i*4+j] += m1[i*4+k] * m2[k*4+j];
      }
    }
  }
  return res;
},


  get_projection: function(angle, a, zMin, zMax) {


    var tan = Math.tan(LIBS.degToRad(0.5*angle)),


        A = -(zMax+zMin)/(zMax-zMin),


        B = (-2*zMax*zMin)/(zMax-zMin);





    return [


      0.5/tan, 0 ,   0, 0,


      0, 0.5*a/tan,  0, 0,


      0, 0,         A, -1,


      0, 0,         B, 0


    ];


  },


  get_I4: function() {


      return [1,0,0,0,


              0,1,0,0,


              0,0,1,0,


              0,0,0,1];


    },


 


    rotateX: function(m, angle) {


      var c = Math.cos(angle);


      var s = Math.sin(angle);


      var mv1=m[1], mv5=m[5], mv9=m[9];


      m[1]=m[1]*c-m[2]*s;


      m[5]=m[5]*c-m[6]*s;


      m[9]=m[9]*c-m[10]*s;


 


      m[2]=m[2]*c+mv1*s;


      m[6]=m[6]*c+mv5*s;


      m[10]=m[10]*c+mv9*s;


    },


 


    rotateY: function(m, angle) {


      var c = Math.cos(angle);


      var s = Math.sin(angle);


      var mv0=m[0], mv4=m[4], mv8=m[8];


      m[0]=c*m[0]+s*m[2];


      m[4]=c*m[4]+s*m[6];


      m[8]=c*m[8]+s*m[10];


 


      m[2]=c*m[2]-s*mv0;


      m[6]=c*m[6]-s*mv4;


      m[10]=c*m[10]-s*mv8;


    },


 


    rotateZ: function(m, angle) {


      var c = Math.cos(angle);


      var s = Math.sin(angle);


      var mv0=m[0], mv4=m[4], mv8=m[8];


      m[0]=c*m[0]-s*m[1];


      m[4]=c*m[4]-s*m[5];


      m[8]=c*m[8]-s*m[9];


 


      m[1]=c*m[1]+s*mv0;


      m[5]=c*m[5]+s*mv4;


      m[9]=c*m[9]+s*mv8;


    },


    translateZ: function(m, t){


      m[14]+=t;


    },


    translateX: function(m, t){


      m[12]+=t;


    },


    translateY: function(m, t){


      m[13]+=t;


    },
    scale: function(m, v) {
      var x = v[0], y = v[1], z = v[2];
      m[0] *= x; m[1] *= x; m[2] *= x; m[3] *= x;
      m[4] *= y; m[5] *= y; m[6] *= y; m[7] *= y;
      m[8] *= z; m[9] *= z; m[10] *= z; m[11] *= z;
      return m;
  },
 
    set_position: function(m,a,b,c){
      m[12]=a, m[13]=b, m[14]=c;
    }


};
