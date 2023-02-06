export function ranDomCode(): string {
    const number = '1234567890';
  
    let code = '';
    for (let i = 0; i < 5; i++) {
      let pos = Math.floor(Math.random() * number.length);
      code += number[pos];
    }
    return code
  }
  