export interface Amount {
    text: string,
    value: number
}
/**
* Returns object representing provided amount (that is given in string).
* When there is a problem parsing the string or the provided value is empty then always 0 (zero) is returned.
* @param amount decimal number as a string, i.e. 1.222
* @returns {*} Object holding parsed values: { value: cents value, text: textual representation}, i.e. { value: 101, text: '1,01'}
*/
export function amountFromString(amount: string):Amount {
 var result = {
   value: 0,
   text: ''
 }
 if(!amount)
   return result;
 // replace commas
 var value = amount.replace(/[,]/g,'.').replace(/\s+/g,'').replace(/[a-zA-Z]+/g,'');  

 var floatValue = 0 ;
 
 floatValue = parseFloat(value);   
 if(Number.isNaN(floatValue))
   floatValue = 0;
 
 result.value = Math.floor(Math.round(floatValue*1e8));
 result.text = (result.value/1e8).toFixed(8)
 
 return result;
 
};