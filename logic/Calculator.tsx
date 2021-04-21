export interface Amount {
    text: string, // formatted
    value: number, // pip units (smallest currency part)
    decomposedText?: {
      whole: string,
      fractional: string
    }
}
/**
* Returns object representing provided amount (that is given in string).
* When there is a problem parsing the string or the provided value is empty then always 0 (zero) is returned.
* @param amount decimal number as a string, i.e. 1.222
* @param unit 'sat' or 'cents', OPTIONAL, default 'sat'
* @returns {*} Object holding parsed values: { value: cents value, text: textual representation}, i.e. { value: 101, text: '1,01'}
*/
export function amountFromString(amount: string, unit?: 'sat'|'cents'):Amount {
 var result:Amount = {
   value: 0,
   text: '',
   decomposedText: undefined
 }
 if(!amount)
   return result;
 // replace commas
 var value = amount.replace(/[,]/g,'.').replace(/\s+/g,'').replace(/[a-zA-Z]+/g,'');  

 var floatValue = 0 ;
 
 floatValue = parseFloat(value); 
 
 
 if(Number.isNaN(floatValue))
   floatValue = 0;

 result = toAmount(floatValue, unit);
 
//  result.value = Math.floor(Math.round(floatValue*(unit&&unit=='cents'?1e2:1e8)));
//  result.text = (result.value/(unit&&unit=='cents'?1e2:1e8)).toFixed(unit&&unit=='cents'?2:8);

//  const wholePart = Math.floor(result.value);
//  const fractionalPart= Math.floor((result.value - wholePart)*(unit&&unit=='cents'?1e2:1e8))

//  result.decomposedText = {
//    whole: wholePart.toFixed(0),
//    fractional: fractionalPart.toFixed(0)
//  }
 
 return result;
 
};

export function toAmount(amountDecimal: number, unit?: 'sat'|'cents'):Amount {
  var result:Amount = {
    value: 0,
    text: '',
    decomposedText: undefined
  }

  var floatValue = 0 ;
 
 floatValue = amountDecimal;   
 if(Number.isNaN(floatValue))
   floatValue = 0;
 
 result.value = Math.floor(Math.round(floatValue*(unit&&unit=='cents'?1e2:1e8)));
 result.text = (result.value>=0?'+':'')+(result.value/(unit&&unit=='cents'?1e2:1e8)).toFixed(unit&&unit=='cents'?2:8);

 const wholePart = amountDecimal>=0?Math.floor(amountDecimal):Math.ceil(amountDecimal);
 const amountPip = amountDecimal*(unit&&unit=='cents'?1e2:1e8);
 const wholePartPip = wholePart*(unit&&unit=='cents'?1e2:1e8)
//  console.log('Amount PIP=',amountPip);
//  console.log('Whole part PIP=',wholePartPip);
//  console.log(amountPip-wholePartPip, (amountPip-wholePartPip)/(unit&&unit=='cents'?1e2:1e8))
 

 result.decomposedText = {
   whole: (wholePart>=0?'+':'')+wholePart.toFixed(0),
   fractional: (Math.abs(amountPip)-Math.abs(wholePartPip)).toFixed(0).padStart(unit&&unit=='cents'?2:8,'0')
 }  
  return result;
};
