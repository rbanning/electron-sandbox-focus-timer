import { primitive } from './primitive';
import { base64 } from './str-base64.utility';
import { ObfuscationLevel } from './str-obfuscation.types';
import { randomString } from './str-random.utility';


const DEFAULT_LEVEL: ObfuscationLevel = 4 as const;

export const obfuscation = {
  encode: (value: unknown, level: ObfuscationLevel = DEFAULT_LEVEL) => {
    if (primitive.isNullish(value)) {
      return '';
    }

    //else
    const noise = randomString(level, true, 'mixed');
    let body = base64.encode(`${value}`);

    //remove the equal sign filler at the end
    let count = 0;
    while(body.endsWith('=')) {
      count += 1;
      body = body.substring(0, body.length-1);
    }
    if (count > 0) {
      body += `.${randomString(count, false, 'mixed')}`;
    }
    
    return noise + body;
  },

  decode: (code: string, size: ObfuscationLevel = DEFAULT_LEVEL) => {
    //remove noise
    code = code.substring(size);
  
    //replace equal size(s)
    const parts = code.split('.');
    if (parts.length > 2) {
      throw new Error("Unable to remove obfuscation (decode) - code contains invalid characters");
    }
    else if (parts.length === 1) {
      //do nothing, code is fine (no filler)
    }
    else { // (parts.length === 2) 
      let count = parts[1].length;
      code = parts[0];
      while (count > 0) {
        count += -1;
        code += '=';
      }
    } 
  
    return base64.decode(code);
  }
} as const;