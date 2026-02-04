export const pseudoCrypto = {
  encrypt,
  decrypt,
} as const;

const MAX_CHAR_CODE = 254;

function encrypt(value: string, key: string, verbose?: boolean) {
  try {
    const characters = value.split('');
    return characters.map((ch, index) => {
      const code = (ch.charCodeAt(0) + key.charCodeAt(index % key.length)) % MAX_CHAR_CODE;
      return String.fromCharCode(code);
    }).join('');
  } catch (error) {
    if (verbose) {
      //only show error if instructed to
      console.warn("Error in pseudoCrypto.encrypt()", {error, value});
    }
    return null; //indicating failure
  }
}

function decrypt(value: string, key: string, verbose?: boolean) {
  try {
    const characters = value.split('');
    return characters.map((ch, index) => {
      let code = (ch.charCodeAt(0) - key.charCodeAt(index % key.length));
      while (code < 0) {
        code += MAX_CHAR_CODE
      }
      return String.fromCharCode(code);
    }).join('');
  } catch (error) {
    if (verbose) {
      //only show error if instructed to
      console.warn("Error in pseudoCrypto.decrypt()", {error, value});
    }
    return null; //indicating failure
  }

}